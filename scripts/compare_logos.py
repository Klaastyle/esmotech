from PIL import Image

ppt_logo_path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\extracted_ppt_images\slide_1_Google Shape_89_p1.png"
target_logo_path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\ESMOTECH_NEGRE_LOGO-upscaled.png"
raw_logo_path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\ESMOTECH_NEGRE_LOGO.jpeg"
code_gen_path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\Code_Generated_Image (1).png"

for p in [ppt_logo_path, target_logo_path, raw_logo_path, code_gen_path]:
    im = Image.open(p)
    print(p)
    print(f"  Format: {im.format}, Size: {im.size}, Mode: {im.mode}")

# Let's inspect transparency, background color, text, etc.
# Check corner pixel color and center
im_target = Image.open(target_logo_path)
im_ppt = Image.open(ppt_logo_path)

print("PPT logo corner pixel:", im_ppt.getpixel((0, 0)))
print("Target logo corner pixel:", im_target.getpixel((0, 0)))

# Let's do an OCR or text check / difference check
try:
    import pytesseract
    # check if tesseract is available
    text_ppt = pytesseract.image_to_string(im_ppt)
    text_target = pytesseract.image_to_string(im_target)
    print("OCR PPT:", text_ppt)
    print("OCR Target:", text_target)
except Exception as e:
    print("OCR not available:", e)
