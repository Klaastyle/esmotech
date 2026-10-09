import os
from PIL import Image, ImageOps
import numpy as np

logos_dir = r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS"
target_logo_path = os.path.join(logos_dir, "ESMOTECH_NEGRE_LOGO-upscaled.png")

# Open the upscaled logo (4096 x 1364)
im = Image.open(target_logo_path).convert("RGBA")
print(f"Original upscaled: {im.size}, mode: {im.mode}")

# We will remove the white background cleanly.
# The background is white (255, 255, 255) or very close.
# Let's compute alpha based on distance from white:
data = np.array(im, dtype=np.float32)
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# In target logo, white pixels are ~ (255, 255, 255).
# Whiteness: min(r, g, b) or similar
# Foreground is either dark (r,g,b < 50), blue (r~0, g~117, b~193), or grey (r,g,b ~ 100)
# A clean threshold / feathering:
# distance from white (255, 255, 255)
dist_from_white = 255.0 - np.minimum(np.minimum(r, g), b)
# Where dist_from_white is 0, alpha is 0. Where dist > 20, alpha ramps to 255.
alpha = np.clip((dist_from_white - 5.0) / 25.0 * 255.0, 0.0, 255.0)

# Clean up colors in near-white semi-transparent zones:
# If dist_from_white > 0, we can adjust color or keep original
out_dark = np.zeros_like(data, dtype=np.uint8)
out_dark[:, :, 0] = np.clip(r, 0, 255).astype(np.uint8)
out_dark[:, :, 1] = np.clip(g, 0, 255).astype(np.uint8)
out_dark[:, :, 2] = np.clip(b, 0, 255).astype(np.uint8)
out_dark[:, :, 3] = alpha.astype(np.uint8)

img_dark = Image.fromarray(out_dark, mode="RGBA")
# Crop to tight content with margin
bbox = img_dark.getbbox()
print("Tight bbox:", bbox)
# Add 3% margin around content
content = img_dark.crop(bbox)
margin = 40
w_new = content.width + margin * 2
h_new = content.height + margin * 2
final_dark = Image.new("RGBA", (w_new, h_new), (0, 0, 0, 0))
final_dark.paste(content, (margin, margin))

# Save 4K transparent dark logo
out_4k_dark = os.path.join(logos_dir, "esmotech-logo-dark-4k.png")
final_dark.save(out_4k_dark, "PNG")
print(f"Saved: {out_4k_dark}, size: {final_dark.size}")

# Standard web size: width ~ 600px (retina for 200-300px display)
web_w = 600
web_h = int(final_dark.height * (web_w / final_dark.width))
web_dark = final_dark.resize((web_w, web_h), Image.Resampling.LANCZOS)
out_web_dark = os.path.join(logos_dir, "esmotech-logo-dark.png")
web_dark.save(out_web_dark, "PNG")
print(f"Saved: {out_web_dark}, size: {web_dark.size}")

# Now create WHITE / NEGATIVE version for dark backgrounds:
# Foreground dark pixels (text ESMOTECH and top/bottom stripes) become pure white (255, 255, 255)
# Blue stripe remains electric blue (0, 136, 255 / 0, 117, 193)
# Grey saw remains or becomes lighter grey
arr_dark = np.array(final_dark, dtype=np.float32)
r_d, g_d, b_d, a_d = arr_dark[:, :, 0], arr_dark[:, :, 1], arr_dark[:, :, 2], arr_dark[:, :, 3]

# Identify blue pixels: b > 150 and b > r + 50 and b > g + 20
is_blue = (b_d > 140) & (b_d > r_d + 40)
# Identify grey saw: r_d ~ g_d ~ b_d and 50 < r_d < 180
is_grey = (~is_blue) & (r_d > 60) & (r_d < 180) & (np.abs(r_d - g_d) < 20) & (np.abs(r_d - b_d) < 20)
# Dark text: (~is_blue) & (~is_grey) & (a_d > 20)
is_dark = (~is_blue) & (~is_grey) & (a_d > 20)

out_white = np.copy(arr_dark)
# Turn dark to white
out_white[is_dark, 0] = 255
out_white[is_dark, 1] = 255
out_white[is_dark, 2] = 255

# Turn grey saw to a slightly brighter silver for dark backgrounds
out_white[is_grey, 0] = np.clip(r_d[is_grey] + 40, 0, 255)
out_white[is_grey, 1] = np.clip(g_d[is_grey] + 40, 0, 255)
out_white[is_grey, 2] = np.clip(b_d[is_grey] + 40, 0, 255)

# Enhance blue to vibrant electric blue (0, 136, 255)
out_white[is_blue, 0] = 0
out_white[is_blue, 1] = 136
out_white[is_blue, 2] = 255

final_white = Image.fromarray(out_white.astype(np.uint8), mode="RGBA")
out_4k_white = os.path.join(logos_dir, "esmotech-logo-white-4k.png")
final_white.save(out_4k_white, "PNG")

web_white = final_white.resize((web_w, web_h), Image.Resampling.LANCZOS)
out_web_white = os.path.join(logos_dir, "esmotech-logo-white.png")
web_white.save(out_web_white, "PNG")
print(f"Saved: {out_web_white}, size: {web_white.size}")

# Now create the ICON / FAVICON (just the 3 stripes symbol on left)
# In final_dark, symbol is located at the leftmost section:
# Let's find symbol bbox in final_dark
arr = np.array(final_dark)
# Symbol is left ~ 0 to 22% of width
sym_w = int(final_dark.width * 0.22)
sym_crop = final_dark.crop((0, 0, sym_w, final_dark.height))
sym_bbox = sym_crop.getbbox()
symbol = sym_crop.crop(sym_bbox)
# Make square with padding
max_side = max(symbol.width, symbol.height)
pad = int(max_side * 0.15)
sq_size = max_side + pad * 2
fav = Image.new("RGBA", (sq_size, sq_size), (0, 0, 0, 0))
paste_x = (sq_size - symbol.width) // 2
paste_y = (sq_size - symbol.height) // 2
fav.paste(symbol, (paste_x, paste_y))

fav_512 = fav.resize((512, 512), Image.Resampling.LANCZOS)
fav_512.save(os.path.join(logos_dir, "esmotech-icon-512.png"), "PNG")
fav_64 = fav.resize((64, 64), Image.Resampling.LANCZOS)
fav_64.save(os.path.join(logos_dir, "esmotech-favicon.png"), "PNG")
fav_32 = fav.resize((32, 32), Image.Resampling.LANCZOS)
fav_32.save(os.path.join(logos_dir, "favicon.ico"), format="ICO")
print("Saved icons and favicons successfully!")
