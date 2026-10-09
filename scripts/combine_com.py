import os

files = [
    ('FICHERO 1', r'C:\Users\Albert\Desktop\Antigravity\esmotech\extracted_pptx_text.txt'),
    ('FICHERO 2', r'C:\Users\Albert\Desktop\Antigravity\esmotech\MEMORIA DEL PROYECTO EMPRESARIAL.docx.com.txt'),
    ('FICHERO 3', r'C:\Users\Albert\Desktop\Antigravity\esmotech\Compeidores.docx.com.txt'),
    ('FICHERO 4', r'C:\Users\Albert\Desktop\Antigravity\esmotech\WEB\ANALISIS COMPETIDORES + GAP ANALYSIS.docx.com.txt'),
    ('FICHERO 5', r'C:\Users\Albert\Desktop\Antigravity\esmotech\SEO\ESTUDIO DE COMPETIDORES Y GAP ANALYSIS.docx.com.txt')
]

out_lines = []
for label, path in files:
    out_lines.append('================================================================================')
    out_lines.append(f'[{label}]')
    orig_path = path.replace('.com.txt', '')
    out_lines.append(f'ORIGINAL: {orig_path}')
    out_lines.append('================================================================================\n')
    if path.endswith('.txt') and not path.endswith('.com.txt'):
        content = open(path, encoding='utf-16').read()
    else:
        content = open(path, encoding='utf-8').read()
    
    # normalize carriage returns
    content = content.replace('\r\n', '\n').replace('\r', '\n')
    out_lines.append(content)
    out_lines.append('\n\n')

full_text = '\n'.join(out_lines)

output_file = r'C:\Users\Albert\.gemini\antigravity\brain\3f4e31ab-24a2-4aa7-93de-32021598bd46\extracted_all_files_com.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f'COM extraction total length: {len(full_text)}')
