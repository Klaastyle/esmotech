
 = New-Object -ComObject Word.Application
.Visible = False

 = @(
    'C:\Users\Albert\Desktop\Antigravity\esmotech\MEMORIA DEL PROYECTO EMPRESARIAL.docx',
    'C:\Users\Albert\Desktop\Antigravity\esmotech\Compeidores.docx',
    'C:\Users\Albert\Desktop\Antigravity\esmotech\WEB\ANALISIS COMPETIDORES + GAP ANALYSIS.docx',
    'C:\Users\Albert\Desktop\Antigravity\esmotech\SEO\ESTUDIO DE COMPETIDORES Y GAP ANALYSIS.docx'
)

foreach ( in ) {
    if (Test-Path ) {
         = .Documents.Open()
         = .Content.Text
        .Close()
         =  + '.com.txt'
        [System.IO.File]::WriteAllText(, , [System.Text.Encoding]::UTF8)
        Write-Host ('Extracted ' +  + ' (' + .Length + ' chars)')
    }
}

.Quit()
