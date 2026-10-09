import os
import re

web_root = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project"

def fix_header_logo(file_path):
    rel_path = os.path.relpath(file_path, web_root)
    is_subfolder = os.sep in rel_path
    prefix = "../" if is_subfolder else ""

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    orig = content

    # Regex to match any <a ... class="logo[^"]*" ...> ... </a>
    def replacer(m):
        full = m.group(0)
        # Check href
        href_match = re.search(r'href=["\']([^"\']+)["\']', full)
        href = href_match.group(1) if href_match else (prefix + "index.html")
        return f"""<a href="{href}" class="logo" aria-label="ESMOTECH Cutting Solutions">
                <img src="{prefix}img/esmotech-logo-white.png" alt="ESMOTECH Cutting Solutions" class="logo-dark">
                <img src="{prefix}img/esmotech-logo-dark.png" alt="ESMOTECH Cutting Solutions" class="logo-light">
            </a>"""

    content = re.sub(
        r'<a\s+[^>]*class=["\'][^"\']*logo[^"\']*["\'][^>]*>.*?</a>',
        replacer,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    if content != orig:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed header logo in: {rel_path}")

for root, dirs, files in os.walk(web_root):
    if "dist" in root.split(os.sep) or "scratch" in root.split(os.sep) or "node_modules" in root.split(os.sep):
        continue
    for f in files:
        if f.endswith(".html"):
            fix_header_logo(os.path.join(root, f))

print("Header logos fix completed!")
