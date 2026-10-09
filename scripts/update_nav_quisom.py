import os, glob

def add_nav_link(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    is_sub = '/serveis/' in filepath.replace('\\', '/') or '/productes/' in filepath.replace('\\', '/')
    link_target = '../qui-som.html' if is_sub else 'qui-som.html'
    inici_target = '../index.html' if is_sub else 'index.html'
    
    needle = f'<li><a href="{inici_target}" class="nav-link">Inici</a></li>'
    replacement = f'{needle}\n                    <li><a href="{link_target}" class="nav-link">Qui Som</a></li>'

    if link_target not in content and needle in content:
        content = content.replace(needle, replacement)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated nav in:', filepath)

for html in glob.glob('web-project/**/*.html', recursive=True):
    if 'dist' not in html and 'qui-som' not in html:
        add_nav_link(html)
