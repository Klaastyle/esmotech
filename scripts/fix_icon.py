from PIL import Image
import numpy as np

im = Image.open(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-logo-dark-4k.png")
arr = np.array(im)
alpha = arr[:, :, 3]

# Check column sums across width in the first 30% of width
w = im.width
h = im.height
col_nonzeros = [np.count_nonzero(alpha[:, x] > 20) for x in range(int(w * 0.35))]

# Find the valley/gap between symbol and "E"
# The symbol starts around x=40, then drops to 0 in the gap between symbol and E
gap_x = -1
for x in range(200, len(col_nonzeros)):
    if col_nonzeros[x] == 0:
        gap_x = x
        break

print(f"Gap found at x = {gap_x}")
# Crop only up to gap_x
sym_clean = im.crop((0, 0, gap_x if gap_x > 0 else 700, h))
sym_bbox = sym_clean.getbbox()
symbol = sym_clean.crop(sym_bbox)
print(f"Clean symbol size: {symbol.size}")

# Square canvas with 15% margin
max_side = max(symbol.width, symbol.height)
pad = int(max_side * 0.15)
sq_size = max_side + pad * 2
fav = Image.new("RGBA", (sq_size, sq_size), (0, 0, 0, 0))
paste_x = (sq_size - symbol.width) // 2
paste_y = (sq_size - symbol.height) // 2
fav.paste(symbol, (paste_x, paste_y))

fav_512 = fav.resize((512, 512), Image.Resampling.LANCZOS)
fav_512.save(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-icon-512.png", "PNG")
fav_64 = fav.resize((64, 64), Image.Resampling.LANCZOS)
fav_64.save(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-favicon.png", "PNG")
fav_32 = fav.resize((32, 32), Image.Resampling.LANCZOS)
fav_32.save(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\favicon.ico", format="ICO")
print("Clean icons and favicon saved!")
