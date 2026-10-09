import os
import re

dist_dir = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\dist"
all_broken = []

for root, dirs, files in os.walk(dist_dir):
    for f in files:
        if f.endswith(".html"):
            html_path = os.path.join(root, f)
            with open(html_path, "r", encoding="utf-8", errors="ignore") as fl:
                content = fl.read()
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
            for src in imgs:
                if src.startswith("http") or src.startswith("data:"):
                    continue
                src_clean = src.split("?")[0].split("#")[0]
                full_path = os.path.normpath(os.path.join(root, src_clean))
                if not os.path.exists(full_path):
                    all_broken.append((os.path.relpath(html_path, dist_dir), src, full_path))

if all_broken:
    print(f"FOUND {len(all_broken)} BROKEN IMAGES:")
    for b in all_broken[:20]:
        print(f"  Page: {b[0]} -> src='{b[1]}'")
else:
    print("Zero broken images across all pages in dist!")
