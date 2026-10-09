from PIL import Image

def test_on_bg(logo_path, bg_color, out_path):
    logo = Image.open(logo_path)
    canvas = Image.new("RGBA", (logo.width + 100, logo.height + 60), bg_color)
    canvas.paste(logo, (50, 30), logo)
    canvas.save(out_path)
    print("Saved test:", out_path)

test_on_bg(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-logo-white.png", (11, 17, 24, 255), r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\test_white_on_dark.png")
test_on_bg(r"C:\Users\Albert\Desktop\Antigravity\esmotech\LOGOS\esmotech-logo-dark.png", (248, 249, 250, 255), r"C:\Users\Albert\Desktop\Antigravity\esmotech\scratch\test_dark_on_light.png")
