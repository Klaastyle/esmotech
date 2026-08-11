import zipfile, xml.etree.ElementTree as ET, os

def extract_docx_full(path):
    with zipfile.ZipFile(path) as z:
        texts = []
        for name in z.namelist():
            if name.startswith('word/') and name.endswith('.xml'):
                tree = ET.fromstring(z.read(name))
                for elem in tree.iter():
                    if elem.tag.endswith('}t') and elem.text:
                        texts.append(elem.text)
                    elif elem.tag.endswith('}p'):
                        texts.append('\n')
        res = ''.join(texts)
        lines = [line.strip() for line in res.split('\n') if line.strip()]
        return '\n'.join(lines)

files = [
    ('FICHERO 1', r'C:\Users\Albert\Desktop\Antigravity\esmotech\extracted_pptx_text.txt'),
    ('FICHERO 2', r'C:\Users\Albert\Desktop\Antigravity\esmotech\MEMORIA DEL PROYECTO EMPRESARIAL.docx'),
    ('FICHERO 3', r'C:\Users\Albert\Desktop\Antigravity\esmotech\Compeidores.docx'),
    ('FICHERO 4', r'C:\Users\Albert\Desktop\Antigravity\esmotech\WEB\ANALISIS COMPETIDORES + GAP ANALYSIS.docx'),
    ('FICHERO 5', r'C:\Users\Albert\Desktop\Antigravity\esmotech\SEO\ESTUDIO DE COMPETIDORES Y GAP ANALYSIS.docx')
]

out_lines = []
for label, path in files:
    out_lines.append(f'================================================================================')
    out_lines.append(f'[{label}]')
    out_lines.append(f'RUTA: {path}')
    out_lines.append(f'================================================================================\n')
    if path.endswith('.txt'):
        content = open(path, encoding='utf-16').read()
    else:
        content = extract_docx_full(path)
    out_lines.append(content)
    out_lines.append('\n\n')

full_text = '\n'.join(out_lines)

output_file = r'C:\Users\Albert\.gemini\antigravity\brain\3f4e31ab-24a2-4aa7-93de-32021598bd46\extracted_all_files.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f'Successfully extracted {len(full_text)} characters into {output_file}')
