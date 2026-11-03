<?php
declare(strict_types=1);
require dirname(__DIR__).'/portal-private/Portal.php';
$seed = json_decode(file_get_contents(dirname(__DIR__).'/portal-private/data/portal.json'), true, flags: JSON_THROW_ON_ERROR);
$passed = 0;
function verify(callable $change, bool $reject = false, ?callable $check = null): void {
    global $seed, $passed;
    $new = $seed;
    $change($new);
    try { PortalRules::apply($seed, $new, ['usuario'=>'test-admin','rol'=>'admin']); }
    catch (PortalError $error) {
        if (!$reject || $error->status !== 422) throw $error;
        ++$passed; return;
    }
    if ($reject) throw new RuntimeException('Invalid data was accepted');
    if ($check) $check($new);
    ++$passed;
}
verify(function (&$data) { $data['paginas'][0]['galeria'] = [['src'=>'/assets/chincha/sede-principal-bb3c09d0.webp','alt'=>'Sede institucional']]; }, false,
    function ($data) { if (count($data['paginas'][0]['versiones']) !== count($GLOBALS['seed']['paginas'][0]['versiones'] ?? []) + 1) throw new RuntimeException('Gallery change missing from page history'); });
verify(fn(&$data) => $data['programas'][0]['galeria'] = [['src'=>'/assets/chincha/sede-principal-bb3c09d0.webp','alt'=>'Sede']]);
verify(fn(&$data) => $data['programas'][0]['galeria'] = [['src'=>'javascript:alert(1)','alt'=>'Invalid']], true);
verify(fn(&$data) => $data['paginas'][0]['galeria'] = array_fill(0, 13, ['src'=>'/test.jpg','alt'=>'Image']), true);
verify(fn(&$data) => $data['paginas'][0]['galeria'] = [['src'=>'/test.jpg','alt'=>str_repeat('a', 241)]], true);
verify(fn(&$data) => $data['jerarquica'][1]['superiorId'] = $data['jerarquica'][0]['id']);
verify(fn(&$data) => $data['jerarquica'][0]['superiorId'] = $data['jerarquica'][0]['id'], true);
verify(function (&$data) { $data['jerarquica'][0]['superiorId']=$data['jerarquica'][1]['id']; $data['jerarquica'][1]['superiorId']=$data['jerarquica'][0]['id']; }, true);
verify(fn(&$data) => $data['jerarquica'][0]['superiorId'] = 'missing', true);
verify(fn(&$data) => $data['config']['inst']['bolsaMineduUrl'] = 'javascript:alert(1)', true);
verify(fn(&$data) => $data['config']['inst']['serviciosActivos'] = ['mesa-de-partes']);
verify(fn(&$data) => $data['config']['inst']['serviciosActivos'] = ['missing'], true);
verify(fn(&$data) => $data['servicios'][0]['implementado'] = 'yes', true);
echo "PASS: $passed server regression checks\n";
