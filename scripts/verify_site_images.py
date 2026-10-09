import os
import re

dist_dir = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\dist"
index_html = os.path.join(dist_dir, "index.html")

with open(index_html, "r", encoding="utf-8") as f:
    html = f.read()

# Find all img src
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
print(f"Total img tags on index.html: {len(imgs)}")

broken = []
for src in imgs:
    # Resolve relative to dist_dir
    src_clean = src.split("?")[0].split("#")[0]
    full_path = os.path.normpath(os.path.join(dist_dir, src_clean))
    if not os.path.exists(full_path):
        broken.append((src, full_path))
    else:
        sz = os.path.getsize(full_path)
        print(f"OK: {src} ({sz} bytes)")

if broken:
    print(f"\nBROKEN IMAGES ({len(broken)}):")
    for b in broken:
        print("  -", b)
else:
    print("\nALL images on index.html exist and are valid!")
