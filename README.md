# Portal IESTP Chincha

Archivos para publicar en Hostinger:

- `portal-private/`: código PHP, vistas y datos. Va **fuera** de `public_html`, al mismo nivel.
- `public_html/`: raíz pública del dominio, con la página, la intranet, el CSS, el JavaScript y las imágenes.

El archivo `portal-private/config.php` (datos de la base de datos y clave de instalación) **no se guarda en GitHub**. Se crea a partir de `portal-private/config.example.php`.

No necesita Composer ni Node: las dependencias PHP y JavaScript van incluidas en el repositorio. Los requisitos del hosting están en la sección siguiente.

## Requisitos del hosting

- **PHP 8.1 o superior** con las extensiones `pdo_mysql`, `fileinfo`, `openssl`, `zlib`, `json` y `session` (Hostinger las trae activas). `mbstring` es recomendable.
- **MariaDB 10.4+ o MySQL 8** (en hPanel, «MySQL» es MariaDB). **Una base de datos por sitio:** las tablas usan el prefijo fijo `pisco_`.
- El sitio debe estar en la **raíz de un dominio o subdominio** (no en una subcarpeta).
- Carpetas con permiso de escritura: `portal-private/` (bloqueo de instalación, `backups/` y la configuración SMTP guardada desde la intranet) y `public_html/assets/cache/`.

## Instalación nueva

1. **Base de datos:** en hPanel › *Bases de datos › Bases de datos MySQL*, crea una base y un usuario con su contraseña. Anota los tres datos.
2. **Descarga el código:** en GitHub, *Code › Download ZIP*.
3. **Sube y extrae:** con el *Administrador de archivos*, sube el ZIP a la carpeta del dominio (la que contiene `public_html`) y extráelo. GitHub mete todo en una carpeta `chincha-main/`; mueve `portal-private/` y `public_html/` desde ahí a la carpeta del dominio y reemplaza el `public_html` vacío.
4. **Configura:** copia `portal-private/config.example.php` como `portal-private/config.php` y completa:
   - `db_name`, `db_user` y `db_password`;
   - `install_key`: una clave privada aleatoria de 32 caracteres o más. Guárdala.
5. **Instala:** abre `https://tu-dominio/install.php`, escribe la `install_key` y crea la cuenta del administrador principal.
6. **Borra** `public_html/install.php`. Después de instalar ya no sirve: si lo vuelves a abrir responde «El portal ya está instalado» (código 410). Mientras el portal no esté instalado, la portada muestra un aviso que indica abrir `/install.php`.
7. **Permisos:** `public_html/assets/cache/` debe tener permisos **755**.
8. **Comprueba:**
   - Abre el sitio y entra a la intranet con la cuenta creada.
   - Revisa *Configuración*: datos institucionales y logo.
   - En *Mesa de partes › Áreas receptoras › Editar áreas*, carga las áreas reales con sus correos.
   - En *Usuarios y roles*, crea las cuentas del personal.

**Correo de notificaciones (recomendado):** en la intranet, *Configuración › Configurar correo notificador (SMTP)*, indica el servidor, la cuenta y su contraseña de aplicación y activa el envío. Después, en hPanel › *Avanzado › Trabajos cron*, crea una tarea **cada minuto** con `php /home/<usuario>/domains/<dominio>/portal-private/mail-worker.php` para los reintentos. Detalles en [MEJORAS-MODULOS.md](MEJORAS-MODULOS.md).

**Opcional, respaldos automáticos:** en hPanel › *Avanzado › Trabajos cron*, crea una tarea diaria con `php /home/<usuario>/domains/<dominio>/portal-private/cron.php`. Luego actívala en la intranet, en *Copias de seguridad*.

**Retención de la auditoría:** el historial de auditoría se conserva 24 meses y lo más antiguo se elimina una vez al día, desde `mail-worker.php` o `cron.php` (basta con que una de las dos tareas esté programada). Para cambiar el plazo, define `'audit_retention_months'` en `config.php` (mínimo 6; `0` lo conserva sin límite). Cada depuración queda registrada en la propia auditoría como «Depurar auditoría».

## Actualizar una instalación existente

Respalda antes los archivos y la base en hPanel.

Sube `portal-private/` y `public_html/` encima de las carpetas actuales y acepta **sobrescribir**. **No borres las carpetas antes:** así se conservan `config.php`, `backups/`, `install.lock` y la configuración SMTP guardada (`.smtp-settings.json`). Después, borra `public_html/install.php`.

La base de datos se actualiza sola la primera vez que se abre el sitio con la versión nueva (por ejemplo, crea la cola de correo `pisco_mail`); no se pierden datos ni cuentas.

Subir archivos no reemplaza el contenido ya guardado en MySQL: lo publicado se sigue editando desde la intranet.

Borra también del servidor `public_html/actualizar.php` y `public_html/recuperar.php` si siguen allí: ya no forman parte del sistema.

## Dónde se edita

- **CSS y JavaScript del portal:** `public_html/assets/app/` (`portal.css` y `portal-1.js` a `portal-4.js`).
- **Armazón de la página:** `portal-private/views/portal.php`.
- **Contenido inicial** que carga la instalación: `portal-private/data/portal.json`.
- **Imágenes:** `public_html/assets/chincha/`. Las imágenes JPG o PNG grandes tienen una copia `.webp` que el servidor entrega automáticamente a los navegadores compatibles.

El historial de pruebas, informes y herramientas de desarrollo sigue disponible en el historial de Git (commit `af1e06f`).

## Cambios de presentación y contenido institucional

- El logo conserva sus proporciones y permanece fijo. El reemplazo por el archivo original aprobado sigue pendiente; se conserva el archivo existente.
- Se retiró la suscripción al boletín del pie de página. Los datos históricos no se eliminan.
- En **Páginas institucionales** y **Programas de estudio**, el editor de galería permite agregar hasta 12 fotografías adicionales, describirlas, ordenarlas y retirarlas. La imagen principal se muestra primero; las galerías se recorren manualmente y permiten ampliar las imágenes. En los programas, una sola galería acompaña Perfil de egreso y Campo laboral. Si un programa antiguo aún no tiene galería, se aprovecha su brochure cuando es una imagen; no se repiten archivos para simular más fotografías.
- Las páginas institucionales compatibles usan fotografías institucionales ya incluidas como presentación inicial; al guardar una galería propia, esa selección prevalece. Una galería vacía conserva únicamente la imagen principal.
- **Reconocimientos** muestra la foto propia que ya admite cada registro. **Plana jerárquica** reúne los cargos y las coordinaciones en una ficha por persona.
- **Organización institucional** muestra el organigrama estructural del Manual de Perfil del Puesto, versión 2024, página 7 del PDF conservado en el repositorio. La imagen se puede ampliar y se enlaza su fuente. Para actualizarlo, carga un organigrama aprobado en la página correspondiente. Como alternativa, registra las dependencias oficiales mediante **Plana jerárquica → Depende jerárquicamente de**; el portal dibuja sus conexiones y rechaza ciclos o referencias inexistentes.
- Los servicios no se anuncian como disponibles por el solo hecho de estar publicados. Confirma su puesta en funcionamiento en **Configuración → Servicios cuya puesta en funcionamiento está confirmada**; para servicios complementarios, marca además **Servicio implementado y disponible para atención** en cada registro. Esto controla su presentación pública, sin borrar registros ni sustituir los permisos de los módulos internos. El correo receptor del Libro de Reclamaciones es obligatorio al habilitar ese servicio; mientras esté deshabilitado, su ausencia no impide guardar otras opciones.
- **Bolsa laboral** abre una plataforma externa. Se conserva el enlace `bolsa-chincha` existente hasta recibir el enlace confirmado de MINEDU, que puede registrarse en **Configuración → Enlace de Bolsa laboral proporcionado por MINEDU**.

### Diseños, carrusel de programas y galería de noticias

Incorporados desde `ranyuo/v2_flv`.

- **Diseño del portal:** en la intranet, *Temas y apariencia › Diseño del portal*, se elige entre **Clásico institucional**, **Moderno**, **Editorial**, **Impacto**, **Impacto Chincha**, **Campus**, **Horizonte** y **Universitario**. *Impacto Chincha* usa la estructura de *Impacto* con los colores del escudo del IESTP Chincha (azul marino, celeste y oro). En todos los diseños los colores se ajustan en *Temas y apariencia › Colores del diseño* (con combinaciones sugeridas); si no se cambian, siguen el tema activo.
- **Programas de estudio en carrusel:** se muestran en carrusel por omisión, en la portada y en la página de programas. Para cambiar a cuadrícula, usa *Vista en la web* en el módulo *Programas de estudio* o *Presentación de los programas de estudio* en *Portada › Bloques, accesos y cifras*.
- **Noticias con varias fotos:** cada noticia admite la imagen principal y hasta 4 fotos adicionales (5 en total). En la web se muestran como galería con visor ampliado.
- **Accesos rápidos:** la instalación nueva incluye *Plataforma Virtual* (`ext:aula`) y *Correo Institucional* (`ext:correo`). Solo aparecen cuando el enlace tiene dirección y el servicio está confirmado en *Configuración*. Subir los archivos no cambia los datos ya guardados: en una instalación existente, agrega los dos accesos en *Portada › Bloques, accesos y cifras*.
- **Distrito y región** (*Configuración*): se usan en el pie de la intranet, en los títulos emitidos y en los datos para buscadores.

### Módulos y correo

- **Servicios con enlace propio:** `mesa-de-partes.php`, `libro-de-reclamaciones.php`, `bolsa-laboral.php` y `certificados.php` abren cada servicio sin la navegación del portal. Siguen sujetos a la confirmación de servicios de *Configuración*.
- **Notificaciones por correo (SMTP):** se configuran en *Configuración*, sección *Configurar correo notificador (SMTP)*. Las credenciales se guardan cifradas con la `install_key` en `portal-private/.smtp-settings.json`. Los mensajes se encolan y los envía `mail-worker.php`.
- **Mesa de partes:** correlativo anual de expedientes y notificación a la mesa de partes y al solicitante. El correo receptor de *Mesa de partes* debe ser válido. La instalación nueva usa `direcciongeneral@iestpchincha.edu.pe`; en una instalación existente, revísalo en la configuración de *Mesa de partes* antes de habilitar el servicio.
- **Trabajos cron:** `mail-worker.php` cada minuto y `cron.php` una vez al día (respaldos y depuración de la auditoría según la retención configurada).

## Pruebas

Desde la raíz del repositorio, con PHP 8.2 o posterior:

```sh
php tests/observaciones.php
```

Las suites de instalación, integridad, permisos, respaldos, correo y volumen se describen en `tests/README.md`. `bash tests/run.sh` las ejecuta con Docker y el flujo `.github/workflows/qa.yml` las corre en cada push.

Las comprobaciones de navegador requieren Node, Playwright y Chromium. Ejecútalas únicamente contra una **instalación local de pruebas**, con la base inicial del repositorio y los servicios aún deshabilitados. Los casos de persistencia modifican temporalmente una galería y la activación de un servicio, y después los restauran. No deben ejecutarse contra producción.

```sh
PORTAL_TEST_URL=http://127.0.0.1:8081 \
CHROMIUM_PATH=/usr/bin/chromium \
node tests/observaciones-browser.cjs
```

Opcionalmente, `PORTAL_TEST_PASSWORD_FILE` apunta a un archivo local con la contraseña de la cuenta de pruebas `devadmin` (otro usuario puede indicarse mediante `PORTAL_TEST_USER`) para validar carga y persistencia tras recargar. No guardes ese archivo en Git. `PORTAL_TEST_SCREENSHOTS` permite indicar una carpeta externa para las capturas.
