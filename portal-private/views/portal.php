<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= htmlspecialchars($bootstrap['data']['config']['seo']['titulo'] ?? $bootstrap['data']['config']['inst']['nombre'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></title>
<meta name="description" content="<?= htmlspecialchars($bootstrap['data']['config']['seo']['descripcion'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0b1d3f">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%230a2a5e'/%3E%3Cpath d='M14 30 32 20l18 10-18 10z' fill='%23f2b705'/%3E%3Cpath d='M22 35v8c6 5 14 5 20 0v-8' fill='none' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:ital,wght@0,600;0,700;0,800;1,600&family=Poppins:wght@500;600;700;800&family=Merriweather:wght@700;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:ital,wght@0,600;0,700;0,800;1,600&family=Poppins:wght@500;600;700;800&family=Merriweather:wght@700;900&display=swap" rel="stylesheet"></noscript>
<link rel="stylesheet" href="<?= portal_asset('portal.css') ?>">
<?php
$localImage=fn(mixed $v):bool=>is_string($v)&&preg_match('#^/(?!/)[^"\'<>\s?]+$#D',$v)===1;
$pageRoot=realpath((string)($_SERVER['DOCUMENT_ROOT']??''))?:dirname(__DIR__,2).'/public_html';
// Logo: se precarga para que la cabecera ya tenga su tamaño al dibujarse (evita el salto de diseño).
$pageLogo=$bootstrap['data']['config']['inst']['logo']??null;
if(!$localImage($pageLogo))$pageLogo=null;
// Carrusel: se envían las dimensiones de sus imágenes para reservar su alto antes de que carguen (CLS).
// No se precarga la imagen: competiría con el CSS y el JavaScript, que son los que dibujan la página.
$imageSizes=[];$homeBlocks=$bootstrap['data']['config']['home']['bloques']??[];
$sliderOn=!is_array($homeBlocks)||!$homeBlocks||array_filter($homeBlocks,fn($b)=>is_array($b)&&($b['k']??'')==='slider'&&!empty($b['on']));
if($sliderOn&&empty($bootstrap['standaloneService'])){
    $heroSlides=array_values(array_filter($bootstrap['data']['slides']??[],fn($s)=>is_array($s)&&empty($s['deleted'])&&in_array($s['estado']??'',['Publicado','Publicada','Activo','Vigente'],true)));
    usort($heroSlides,fn($a,$b)=>(float)($a['orden']??0)<=>(float)($b['orden']??0));
    foreach(array_slice($heroSlides,0,12) as $slide){
        $src=$slide['imagen']??null;if(!$localImage($src)||isset($imageSizes[$src]))continue;
        $file=realpath($pageRoot.$src);if(!$file||!str_starts_with($file,$pageRoot.DIRECTORY_SEPARATOR))continue;
        $size=@getimagesize($file);if($size&&$size[0]>0&&$size[1]>0)$imageSizes[$src]=[(int)$size[0],(int)$size[1]];
    }
}
if($pageLogo): ?>
<link rel="preload" as="image" href="<?= htmlspecialchars($pageLogo, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
<?php endif; if($imageSizes): ?>
<script>window.PORTAL_IMAGE_SIZES=<?= json_encode($imageSizes, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) ?>;</script>
<?php endif; ?>
</head>
<body>
<noscript><p style="padding:20px">Este portal requiere JavaScript habilitado.</p></noscript>
<div id="app" aria-live="off"></div>
<script>window.PORTAL_BOOTSTRAP = <?= json_encode(PortalContent::forJson($bootstrap), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR) ?>;</script>
<div class="ix ix-layer" id="ix-layer" data-palette="web"><div id="ixmodal"></div></div>
<script defer src="<?= portal_asset('portal-1.js') ?>"></script>
<script defer src="<?= portal_asset('portal-2.js') ?>"></script>
<script defer src="<?= portal_asset('portal-3.js') ?>"></script>
<script defer src="<?= portal_asset('portal-4.js') ?>"></script>
<script defer src="<?= portal_asset('portal-observaciones.js') ?>"></script>
<script defer src="<?= portal_asset('/portal-server.js') ?>"></script>
<script defer src="<?= portal_asset('/academic-documents.js') ?>"></script>
<script defer src="<?= portal_asset('/standalone-services.js') ?>"></script>
<script defer src="<?= portal_asset('/mail-settings.js') ?>"></script>
</body>
</html>
