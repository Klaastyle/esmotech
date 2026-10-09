import re

path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\brand-book.html"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Replace any occurrence of #C9A84C with #0088FF and name with Blau Elèctric
c = c.replace("copyColor('#C9A84C', 'Or Esmotech')", "copyColor('#0088FF', 'Blau Elèctric Esmotech')")
c = c.replace("background: #C9A84C;", "background: #0088FF;")
c = c.replace(">Or Esmotech<", ">Blau Elèctric (Accent)<")
c = c.replace("#C9A84C", "#0088FF")
c = c.replace("#c9a84c", "#0088FF")
c = c.replace("Ús del Daurat", "Ús del Blau Elèctric")
c = c.replace("Us del Daurat", "Ús del Blau Elèctric")
c = c.replace("Daurat", "Blau Elèctric")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated brand-book.html with python cleanly!")
