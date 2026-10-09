import os
import shutil

src_logos = r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS"
dest_web_img = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\img"
dest_dist_img = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\dist\img"

files_to_copy = [
    ("esmotech-logo-dark.png", "esmotech-logo-dark.png"),
    ("esmotech-logo-white.png", "esmotech-logo-white.png"),
    ("esmotech-logo-white.png", "logo-esmotech.png"), # default replacement for logo-esmotech.png
    ("esmotech-icon-512.png", "esmotech-icon-512.png"),
    ("esmotech-icon-white-512.png", "esmotech-icon-white-512.png"),
    ("esmotech-favicon.png", "esmotech-favicon.png"),
    ("favicon.ico", "favicon.ico"),
    ("esmotech-logo-dark-4k.png", "esmotech-logo-dark-4k.png"),
    ("esmotech-logo-white-4k.png", "esmotech-logo-white-4k.png")
]

for src_name, dest_name in files_to_copy:
    src_file = os.path.join(src_logos, src_name)
    for target_dir in [dest_web_img, dest_dist_img]:
        os.makedirs(target_dir, exist_ok=True)
        dest_file = os.path.join(target_dir, dest_name)
        shutil.copy2(src_file, dest_file)
        print(f"Copied {src_name} -> {dest_file}")

# Also copy favicon to web-project root and dist root
for root_target in [r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project", r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\dist"]:
    shutil.copy2(os.path.join(src_logos, "favicon.ico"), os.path.join(root_target, "favicon.ico"))
    shutil.copy2(os.path.join(src_logos, "esmotech-favicon.png"), os.path.join(root_target, "favicon.png"))
    print(f"Copied favicons to root {root_target}")
