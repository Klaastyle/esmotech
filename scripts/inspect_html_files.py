import os
import glob
import re

html_files = []
for root, dirs, files in os.walk(r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project"):
    if "dist" in root.split(os.sep) or "scratch" in root.split(os.sep) or "node_modules" in root.split(os.sep):
        continue
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f))

print(f"Total HTML files to inspect: {len(html_files)}")

gold_pattern = re.compile(r"(c9a84c|b39035|dfc070|201,\s*168,\s*76)", re.IGNORECASE)
logo_pattern = re.compile(r'<a\s+[^>]*class=["\']logo["\'][^>]*>(.*?)</a>', re.DOTALL | re.IGNORECASE)

for path in html_files:
    rel = os.path.relpath(path, r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    golds = gold_pattern.findall(content)
    has_favicon = "favicon" in content.lower()
    logos = logo_pattern.findall(content)
    if golds or not has_favicon or logos:
        print(f"File: {rel}")
        if golds:
            print(f"  Gold matches count: {len(golds)}")
        if not has_favicon:
            print(f"  Missing favicon tag!")
        if logos:
            print(f"  Logo snippet: {logos[0].strip()[:60]}...")
