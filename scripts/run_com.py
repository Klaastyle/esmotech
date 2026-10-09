import subprocess

ps_script = r"""
$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    'C:\Users\Albert\Desktop\Antigravity\esmotech\MEMORIA DEL PROYECTO EMPRESARIAL.docx',
    'C:\Users\Albert\Desktop\Antigravity\esmotech\Compeidores.docx',
    'C:\Users\Albert\Desktop\Antigravity\esmotech\WEB\ANALISIS COMPETIDORES + GAP ANALYSIS.docx',
    'C:\Users\Albert\Desktop\Antigravity\esmotech\SEO\ESTUDIO DE COMPETIDORES Y GAP ANALYSIS.docx'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $doc = $word.Documents.Open($f)
        $text = $doc.Content.Text
        $doc.Close()
        $outPath = $f + '.com.txt'
        [System.IO.File]::WriteAllText($outPath, $text, [System.Text.Encoding]::UTF8)
        Write-Host "Extracted $f"
    }
}

$word.Quit()
"""

with open('run_com.ps1', 'w', encoding='utf-8') as f:
    f.write(ps_script)

res = subprocess.run(['powershell', '-ExecutionPolicy', 'Bypass', '-File', 'run_com.ps1'], capture_output=True, text=True)
print('STDOUT:', res.stdout)
print('STDERR:', res.stderr)
