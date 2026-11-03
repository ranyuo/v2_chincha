/* Ejecutar únicamente contra una base de pruebas aislada. Véase README.md. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const base = process.env.PORTAL_TEST_URL || 'http://127.0.0.1:8081';
const output = process.env.PORTAL_TEST_SCREENSHOTS;
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const open = async route => {
      await page.goto(base + '/' + route);
      await page.waitForSelector('.site-footer');
      await page.locator('h1').first().waitFor();
    };
    const capture = async name => {
      if (output) { fs.mkdirSync(output, { recursive: true }); await page.screenshot({ path: path.join(output, name + '.png'), fullPage: true }); }
    };
    await open('#/');
    assert.equal(await page.locator('[data-newsletter]').count(), 0);
    assert.equal(await page.locator('.topbar a').filter({ hasText: 'Biblioteca virtual' }).count(), 0);
    const logo = await page.locator('.site-header .brand img').evaluate(el => ({ animation: getComputedStyle(el).animationName, transform: getComputedStyle(el).transform }));
    assert.equal(logo.animation, 'none'); assert.equal(logo.transform, 'none');
    await page.locator('.site-header .brand').hover();
    assert.equal(await page.locator('.site-header .brand img').evaluate(el => getComputedStyle(el).transform), 'none');
    await capture('inicio-desktop');
    await open('#/nosotros/reconocimientos');
    const count = await page.evaluate(() => P('reconocimientos').filter(isPub).filter(r => r.foto).length);
    assert.equal(await page.locator('.timeline [data-enlarge]').count(), count);
    await capture('reconocimientos-desktop');
    await page.locator('.timeline [data-enlarge]').first().click();
    await page.locator('.image-full').waitFor(); await page.keyboard.press('Escape');
    assert.equal(await page.locator('.image-full').count(), 0);
    await open('#/nosotros/plana-jerarquica');
    const names = await page.locator('.collage figcaption strong, .director .msg>strong').allTextContents();
    assert.equal(names.length, new Set(names).size);
    await capture('plana-jerarquica-desktop');
    const program = await page.evaluate(() => progs()[0]);
    await open('#/programas/' + program.slug);
    assert.equal(await page.locator('.program-overview [data-gallery]').count(), 1);
    assert(await page.locator('[data-program-section="campo-laboral"]').isVisible());
    const counter = page.locator('.program-gallery [data-gallery-count]');
    const first = await counter.innerText();
    await page.locator('.program-gallery [data-gallery-next]').click();
    assert.notEqual(await counter.innerText(), first);
    await page.locator('.program-gallery [data-gallery-prev]').click();
    assert.equal(await counter.innerText(), first);
    await capture('programa-desktop');
    await open('#/nosotros/organizacion');
    assert.equal(await page.locator('img[src*="organigrama-mpp-2024"]').count(), 1);
    assert(await page.locator('a[href$=".pdf#page=7"]').count());
    await capture('organigrama-desktop');
    const chartReview = await page.evaluate(() => {
      const record = page('organizacion'), original = record.organigrama;
      try {
        record.organigrama = '/assets/chincha/sede-principal-bb3c09d0.webp';
        const html = ROUTES['nosotros/organizacion'](['nosotros', 'organizacion']);
        return { showsCustomChart: html.includes(record.organigrama), citesManual: html.includes('Manual de Perfil del Puesto, versión 2024') };
      } finally { if (original === undefined) delete record.organigrama; else record.organigrama = original; }
    });
    assert(chartReview.showsCustomChart); assert.equal(chartReview.citesManual, false);
    const editors = await page.evaluate(() => ['privacidad', 'terminos', 'faq', 'resena'].map(key => ({ key, gallery: SPECS.paginas.fields(page(key)).some(field => field.n === 'galeria') })));
    assert.deepEqual(editors.map(editor => editor.gallery), [false, false, false, true]);
    const sitemapReview = await page.evaluate(() => {
      const originalDownload = downloadText, originalServices = inst().serviciosActivos;
      let xml = '';
      try {
        downloadText = text => { xml = text; };
        inst().serviciosActivos = []; downloadSitemap(); const disabled = xml;
        inst().serviciosActivos = ['mesa-de-partes', 'libro-de-reclamaciones']; downloadSitemap();
        return { disabled, enabled: xml };
      } finally {
        downloadText = originalDownload;
        if (originalServices === undefined) delete inst().serviciosActivos; else inst().serviciosActivos = originalServices;
      }
    });
    for (const route of ['/servicios/mesa-de-partes', '/servicios/consulta-certificados', '/transparencia/libro-de-reclamaciones']) assert(!sitemapReview.disabled.includes(route));
    assert(sitemapReview.disabled.includes('/servicios/bolsa-laboral'));
    assert(sitemapReview.enabled.includes('/servicios/mesa-de-partes'));
    assert(sitemapReview.enabled.includes('/transparencia/libro-de-reclamaciones'));
    assert(!sitemapReview.enabled.includes('/servicios/consulta-certificados'));

    await open('#/servicios');
    assert.equal(await page.locator('.service-external a').count(), 1);
    assert.equal(await page.locator('a[href="#/servicios/mesa-de-partes"]').count(), 0);
    await capture('servicios-desktop');
    for (const route of ['#/servicios/mesa-de-partes', '#/servicios/libro-de-reclamaciones', '#/transparencia/libro-de-reclamaciones', '#/libro-de-reclamaciones']) {
      await open(route); assert.equal(await page.locator('h1').innerText(), 'Servicio no disponible');
    }
    for (const route of ['#/', '#/programas/' + program.slug, '#/nosotros/organizacion', '#/nosotros/plana-jerarquica', '#/servicios']) {
      await page.setViewportSize({ width: 390, height: 844 }); await open(route);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Desbordamiento horizontal en ' + route);
    }
    await open('#/programas/' + program.slug); await capture('programa-mobile');
    // Carga, guardado real y lectura tras recarga; siempre en una base local de pruebas.
    if (process.env.PORTAL_TEST_PASSWORD_FILE) {
      const password = fs.readFileSync(process.env.PORTAL_TEST_PASSWORD_FILE, 'utf8').trim();
      const state = await (await page.request.get(base + '/?route=api/portal')).json();
      const login = await page.request.post(base + '/?route=api/session', { headers: { 'X-CSRF-Token': state.csrf }, data: { username: process.env.PORTAL_TEST_USER || 'devadmin', password } });
      assert.equal(login.status(), 200);
      await page.reload();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(base + '/#/admin/programas/' + program.id);
      await page.locator('[data-gallery-upload]').waitFor({ state: 'attached' });
      const original = await page.evaluate(id => structuredClone(DB.programas.find(p => p.id === id).galeria ?? null), program.id);
      try {
        await page.locator('[data-gallery-upload]').setInputFiles(path.join(__dirname, '../public_html/assets/chincha/sede-principal-bb3c09d0.webp'));
        await page.waitForFunction(() => EDITOR_UPLOADS.size === 0 && ADM.work.galeria.length >= 2);
        await page.locator('[data-gallery-alt]').last().fill('Fotografía de prueba de persistencia');
        const submit = page.locator('[data-cf]').getByRole('button', { name: 'Guardar cambios', exact: true });
        await submit.click();
        await page.waitForTimeout(400);
        await page.reload();
        const persisted = await page.evaluate(id => DB.programas.find(p => p.id === id).galeria, program.id);
        assert(persisted.some(item => item.alt === 'Fotografía de prueba de persistencia'));
        await page.goto(base + '/#/admin/config'); await page.locator('[name=bolsaMineduUrl]').waitFor();
        assert.equal(await page.locator('[name=serviciosActivos]').count(), 6);
      } finally {
        await page.evaluate(({ id, original }) => { const program = DB.programas.find(p => p.id === id); if (original === null) delete program.galeria; else program.galeria = original; if (!saveDB()) throw new Error('No se pudo restaurar la galería de prueba'); }, { id: program.id, original });
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: browser checks, desktop/mobile, gallery controls, images, service availability' + (process.env.PORTAL_TEST_PASSWORD_FILE ? ', upload and persistence after reload' : ''));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
