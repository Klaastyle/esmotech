from PIL import Image

im_target = Image.open(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\ESMOTECH_NEGRE_LOGO-upscaled.png")

# Let's check non-white/non-grey pixels in Target logo
has_chroma = []
for p in im_target.getdata():
    r, g, b = p[:3]
    # If not white/grey
    max_diff = max(abs(r - g), abs(r - b), abs(g - b))
    if max_diff > 20: # has visible color saturation
        has_chroma.append((r, g, b))

print(f"Total chromatic pixels in target logo: {len(has_chroma)} out of {im_target.width * im_target.height}")
if has_chroma:
    print("Sample chromatic pixels:", has_chroma[:10])
