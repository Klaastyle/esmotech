from PIL import Image

im_ppt = Image.open(r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\extracted_ppt_images\slide_1_Google Shape_89_p1.png")
im_target = Image.open(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\ESMOTECH_NEGRE_LOGO-upscaled.png")

# Let's inspect unique colors or colors of the non-transparent/non-white pixels
# Convert im_target to RGBA with white as transparent or compare them
print("PPT logo mode:", im_ppt.mode)
# Find the dominant colors in the foreground
colors_ppt = im_ppt.getcolors(maxcolors=100000)
# Sort by count
colors_ppt.sort(key=lambda x: x[0], reverse=True)
print("Top 10 colors in PPT logo:")
for count, col in colors_ppt[:10]:
    print(f"  {col}: {count}")

colors_target = im_target.getcolors(maxcolors=1000000)
colors_target.sort(key=lambda x: x[0], reverse=True)
print("\nTop 10 colors in Target logo:")
for count, col in colors_target[:10]:
    print(f"  {col}: {count}")
