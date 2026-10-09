import re

css_path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\css\components.css"
with open(css_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Badge gold
content = re.sub(
    r"\.badge-gold\s*\{[^}]*\}",
    """.badge-blue,
.badge-gold {
  background-color: var(--primary-muted);
  border: 1px solid var(--primary);
  color: var(--primary);
}""",
    content
)

# 2. OEM finder borders and gradients
content = content.replace("rgba(201, 168, 76, 0.35)", "rgba(0, 136, 255, 0.35)")
content = content.replace("rgba(201, 168, 76, 0.12)", "rgba(0, 136, 255, 0.15)")
content = content.replace("linear-gradient(90deg, #c9a84c, #e63946, #c9a84c)", "linear-gradient(90deg, #0088ff, #38bdf8, #0088ff)")
content = content.replace("var(--primary, #c9a84c)", "var(--primary, #0088ff)")
content = content.replace("border-color: #c9a84c;", "border-color: #0088ff;")
content = content.replace("rgba(201, 168, 76, 0.04)", "rgba(0, 136, 255, 0.05)")
content = content.replace("rgba(201, 168, 76, 0.2)", "rgba(0, 136, 255, 0.25)")
content = content.replace("rgba(201, 168, 76, 0.18)", "rgba(0, 136, 255, 0.18)")

with open(css_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated components.css successfully!")
