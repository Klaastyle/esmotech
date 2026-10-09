from PIL import Image
import numpy as np

im = Image.open(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-icon-512.png")
arr = np.array(im, dtype=np.float32)
r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

is_blue = (b > 140) & (b > r + 40)
is_dark = (~is_blue) & (a > 20)

out = np.copy(arr)
# Turn dark to white
out[is_dark, 0] = 255
out[is_dark, 1] = 255
out[is_dark, 2] = 255
# Electric blue
out[is_blue, 0] = 0
out[is_blue, 1] = 136
out[is_blue, 2] = 255

im_white = Image.fromarray(out.astype(np.uint8), mode="RGBA")
im_white.save(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-icon-white-512.png")
im_white.resize((64, 64), Image.Resampling.LANCZOS).save(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-icon-white.png")
print("White icon saved!")
