import os
import shutil

extracted_dir = r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\extracted_ppt_images"
dest_web_img = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\img"
dest_dist_img = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\dist\img"

mapping = {
    "slide_1_Google Shape_85_p1.png": "hero-industrial-sparks.png",
    "slide_4_Google Shape_207_p4.jpg": "plaques-picadora-industrial.jpg",
    "slide_5_Google Shape_237_p5.jpg": "serres-cinta-industrials.jpg",
    "slide_6_Google Shape_264_p6.png": "discs-peces-rectificades.png",
    "slide_7_Google Shape_290_p7.png": "cutters-skinners-industrial.png",
    "slide_9_Google Shape_331_p9.jpg": "hagedorn-foodtech-germany.jpg",
    "slide_10_Google Shape_360_p10.png": "tritech-blade.png",
    "slide_10_Google Shape_361_p10.jpg": "longlife-blade.jpg",
    "slide_10_Google Shape_362_p10.jpg": "genesis-blade.jpg"
}

for src_name, dest_name in mapping.items():
    src_file = os.path.join(extracted_dir, src_name)
    if os.path.exists(src_file):
        for target_dir in [dest_web_img, dest_dist_img]:
            shutil.copy2(src_file, os.path.join(target_dir, dest_name))
            print(f"Copied {src_name} -> {dest_name}")
