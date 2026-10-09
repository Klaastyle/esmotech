import os
import re

web_root = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project"

def process_file(file_path):
    rel_path = os.path.relpath(file_path, web_root)
    is_subfolder = os.sep in rel_path
    prefix = "../" if is_subfolder else ""
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    orig = content
    
    # 1. Favicon in <head>
    if "favicon.ico" not in content and "esmotech-favicon.png" not in content:
        favicon_tags = f"""    <!-- Favicon & Icons ESMOTECH -->
    <link rel="icon" type="image/x-icon" href="{prefix}favicon.ico">
    <link rel="icon" type="image/png" sizes="64x64" href="{prefix}img/esmotech-favicon.png">
    <link rel="apple-touch-icon" sizes="512x512" href="{prefix}img/esmotech-icon-512.png">
"""
        # Insert before </head>
        content = re.sub(r"(</head>)", favicon_tags + r"\1", content, count=1, flags=re.IGNORECASE)
        
    # 2. Header Logo
    # Match <a ... class="logo" ...> ... </a>
    def replace_logo_header(match):
        full_a = match.group(0)
        # Check if already has logo-dark / logo-light
        if "logo-dark" in full_a:
            return full_a
        href_match = re.search(r'href=["\']([^"\']+)["\']', full_a)
        href = href_match.group(1) if href_match else (prefix + "index.html")
        return f"""<a href="{href}" class="logo" aria-label="ESMOTECH Cutting Solutions">
                <img src="{prefix}img/esmotech-logo-white.png" alt="ESMOTECH Cutting Solutions" class="logo-dark">
                <img src="{prefix}img/esmotech-logo-dark.png" alt="ESMOTECH Cutting Solutions" class="logo-light">
            </a>"""

    content = re.sub(
        r'<a\s+[^>]*class=["\']logo["\'][^>]*>.*?</a>',
        replace_logo_header,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # 3. Footer Logo
    # In footer: <span class="logo"...><img src="...logo-esmotech.png"...></span>
    def replace_logo_footer(match):
        return f"""<span class="logo" style="margin-bottom: 1.2rem;">
                    <img src="{prefix}img/esmotech-logo-white.png" alt="ESMOTECH Cutting Solutions" style="height: 42px; width: auto; max-width: 240px;">
                </span>"""
                
    content = re.sub(
        r'<span\s+class=["\']logo["\'][^>]*>\s*<img\s+[^>]*logo-esmotech\.png[^>]*>\s*</span>',
        replace_logo_footer,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # Also if there's any remaining single img src="...logo-esmotech.png"
    # replace with esmotech-logo-white.png
    content = content.replace(f'src="{prefix}img/logo-esmotech.png"', f'src="{prefix}img/esmotech-logo-white.png"')
    
    # 4. Gold Colors & Gradients
    content = content.replace("linear-gradient(135deg, #c9a84c, #b39035)", "linear-gradient(135deg, #0088FF, #0066CC)")
    content = content.replace("linear-gradient(135deg, #C9A84C, #B39035)", "linear-gradient(135deg, #0088FF, #0066CC)")
    content = content.replace("linear-gradient(135deg, #c9a84c, #A8882C)", "linear-gradient(135deg, #0088FF, #0066CC)")
    content = content.replace("rgba(201,168,76,0.15)", "rgba(0, 136, 255, 0.15)")
    content = content.replace("rgba(201, 168, 76, 0.15)", "rgba(0, 136, 255, 0.15)")
    content = content.replace("rgba(201,168,76,0.1)", "rgba(0, 136, 255, 0.12)")
    content = content.replace("rgba(201, 168, 76, 0.1)", "rgba(0, 136, 255, 0.12)")
    content = content.replace("rgba(201,168,76,0.3)", "rgba(0, 136, 255, 0.3)")
    content = content.replace("rgba(201, 168, 76, 0.3)", "rgba(0, 136, 255, 0.3)")
    content = content.replace("border: 1px solid #c9a84c", "border: 1px solid var(--primary)")
    content = content.replace("border: 1px solid #C9A84C", "border: 1px solid var(--primary)")
    content = content.replace("color: #c9a84c;", "color: var(--primary);")
    content = content.replace("color: #C9A84C;", "color: var(--primary);")
    content = content.replace('stroke="#C9A84C"', 'stroke="#0088FF"')
    content = content.replace('stroke="#c9a84c"', 'stroke="#0088FF"')
    content = content.replace('fill="#C9A84C"', 'fill="#0088FF"')
    content = content.replace('fill="#c9a84c"', 'fill="#0088FF"')
    content = content.replace("d\\'Envasat", "d'Envasat")

    if content != orig:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated: {rel_path}")

# Run for all html files in web-project excluding dist/scratch
for root, dirs, files in os.walk(web_root):
    if "dist" in root.split(os.sep) or "scratch" in root.split(os.sep) or "node_modules" in root.split(os.sep):
        continue
    for f in files:
        if f.endswith(".html"):
            process_file(os.path.join(root, f))

print("All HTML files processed!")
