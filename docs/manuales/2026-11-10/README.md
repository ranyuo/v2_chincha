# Manuales de Chincha · edición web actual

Sitio revisado: https://web.iestpchincha.edu.pe/  
Fecha: 10 de noviembre de 2026 · America/Lima.

[Descargar el paquete completo en Word y PDF](Manuales_CHINCHA_Word_PDF.zip?raw=true).

| Documento | Páginas | Word editable | PDF |
| --- | ---: | --- | --- |
| Manual del sistema | 65 | [Word](Manual_del_sistema_CHINCHA.docx?raw=true) | [PDF](Manual_del_sistema_CHINCHA.pdf) |
| Manual técnico | 31 | [Word](Manual_tecnico_CHINCHA.docx?raw=true) | [PDF](Manual_tecnico_CHINCHA.pdf) |
| Diagramas y diccionario de datos | 14 | [Word](Diagrama_base_de_datos_CHINCHA.docx?raw=true) | [PDF](Diagrama_base_de_datos_CHINCHA.pdf) |
| Cuaderno de 24 talleres | 32 | [Word](Cuaderno_de_talleres_CHINCHA.docx?raw=true) | [PDF](Cuaderno_de_talleres_CHINCHA.pdf) |

También se incluyen diagramas físicos y funcionales en PNG, SVG y DOT, y SHA256SUMS.txt para verificar los documentos.

## Alcance de la edición

Se revisó el acceso y la navegación administrativa del sitio indicado y se obtuvieron capturas reales de Chincha. Se contrastó el código de `ranyuo/v2_chincha`, commit `b6f6d34488cbcb10dfeef22fac0528e758b1544a`: los seis scripts principales publicados coinciden por hash Git con esa revisión. No se accedió a SQL ni a la administración del hosting; esa coincidencia no certifica su configuración privada.

Esta edición documenta el esquema 7 del proyecto: **9 tablas, 60 campos**, con el prefijo heredado **pisco_** que realmente conserva el código de Chincha. No se sustituyó ese prefijo por nombres de tablas ficticios. Incluye también los campos JSON de servicios confirmados, galerías y jerarquía institucional.

Los procedimientos distinguen la configuración observada de la atención pública: Mesa de Partes, Libro de Reclamaciones y Consulta de certificados mostraban **Servicio no disponible** al revisar el sitio. La Bolsa Laboral pública dirige a una plataforma externa. Los manuales no afirman que haya sincronización con el panel interno o que compartan credenciales.

No se cambiaron contenidos, permisos ni disponibilidad de servicios; no se emitieron documentos, enviaron trámites ni ejecutaron restauraciones para elaborar esta edición. Las prácticas que crean registros se realizan en QA. Los archivos no incluyen credenciales ni volcados del sistema.

La estructura sigue los modelos PALPA aportados. Los manuales antiguos de `documentacion/Chincha` se conservan; su fuente, dirección y esquema no se confunden con esta revisión del sitio web actual.
