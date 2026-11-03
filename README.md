# Portal IESTP Chincha

Archivos para publicar en Hostinger:

- `portal-private/`: código PHP, vistas y datos. Va **fuera** de `public_html`, al mismo nivel.
- `public_html/`: raíz pública del dominio, con la página, la intranet, el CSS, el JavaScript y las imágenes.

El archivo `portal-private/config.php` (datos de la base de datos y clave de instalación) **no se guarda en GitHub**. Se crea a partir de `portal-private/config.example.php`.

Requiere PHP 8.2 o posterior con PDO MySQL, sesiones, Fileinfo y Zlib, y MySQL/MariaDB. No necesita Composer ni Node.

## Instalación nueva

1. **Base de datos:** en hPanel › *Bases de datos › Bases de datos MySQL*, crea una base y un usuario con su contraseña. Anota los tres datos.
2. **Descarga el código:** en GitHub, *Code › Download ZIP*.
3. **Sube y extrae:** con el *Administrador de archivos*, sube el ZIP a la carpeta del dominio (la que contiene `public_html`) y extráelo. GitHub mete todo en una carpeta `chincha-main/`; mueve `portal-private/` y `public_html/` desde ahí a la carpeta del dominio y reemplaza el `public_html` vacío.
4. **Configura:** copia `portal-private/config.example.php` como `portal-private/config.php` y completa:
   - `db_name`, `db_user` y `db_password`;
   - `install_key`: una clave privada aleatoria de 32 caracteres o más. Guárdala.
5. **Instala:** abre `https://tu-dominio/install.php`, escribe la `install_key` y crea la cuenta del administrador principal.
6. **Borra** `public_html/install.php`. Después de instalar ya no sirve; si lo vuelves a abrir indica que el portal ya está instalado.
7. **Permisos:** `public_html/assets/cache/` debe tener permisos **755**.
8. **Comprueba:**
   - Abre el sitio y entra a la intranet con la cuenta creada.
   - Revisa *Configuración*: datos institucionales y logo.
   - En *Mesa de partes › Áreas receptoras › Editar áreas*, carga las áreas reales con sus correos.
   - En *Usuarios y roles*, crea las cuentas del personal.

**Opcional, respaldos automáticos:** en hPanel › *Avanzado › Trabajos cron*, crea una tarea diaria con `php /home/<usuario>/domains/<dominio>/portal-private/cron.php`. Luego actívala en la intranet, en *Copias de seguridad*.

## Actualizar una instalación existente

Respalda antes los archivos y la base en hPanel.

Sube `portal-private/` y `public_html/` encima de las carpetas actuales y acepta **sobrescribir**. **No borres las carpetas antes:** así se conservan `config.php`, `backups/` e `install.lock`. Después, borra `public_html/install.php`.

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

### Comprobaciones de regresión

Desde la raíz del repositorio, con PHP 8.2 o posterior:

```sh
php tests/observaciones.php
```

Las comprobaciones de navegador requieren Node, Playwright y Chromium. Ejecuta únicamente contra una **instalación local de pruebas**, con la base inicial del repositorio y los servicios aún deshabilitados. Los casos de persistencia modifican temporalmente una galería y la activación de un servicio, y después los restauran; no debe ejecutarse contra producción.

```sh
PORTAL_TEST_URL=http://127.0.0.1:8081 \
CHROMIUM_PATH=/usr/bin/chromium \
node tests/observaciones-browser.cjs
```

Opcionalmente, `PORTAL_TEST_PASSWORD_FILE` apunta a un archivo local con la contraseña de la cuenta de pruebas `devadmin` (otro usuario puede indicarse mediante `PORTAL_TEST_USER`) para validar carga y persistencia tras recargar. No guardes ese archivo en Git. `PORTAL_TEST_SCREENSHOTS` permite indicar una carpeta externa para las capturas.
