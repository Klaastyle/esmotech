from PIL import Image

def analyze_image(path):
    im = Image.open(path)
    print(f"=== {path} ===")
    print(f"Size: {im.size}, Format: {im.format}, Mode: {im.mode}")
    # Get bounding box of non-white / non-transparent
    if im.mode == 'RGBA':
        alpha = im.split()[-1]
        bbox = alpha.getbbox()
        print(f"Non-transparent bbox: {bbox}")
    elif im.mode == 'RGB':
        # Find non-white bbox
        gray = im.convert('L')
        # invert threshold
        bw = gray.point(lambda x: 255 if x < 240 else 0)
        bbox = bw.getbbox()
        print(f"Non-white bbox: {bbox}")

analyze_image(r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\extracted_ppt_images\slide_1_Google Shape_89_p1.png")
analyze_image(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\ESMOTECH_NEGRE_LOGO-upscaled.png")
analyze_image(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\Code_Generated_Image (1).png")
analyze_image(r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\extracted_ppt_images\slide_1_Google Shape_88_p1.png")
