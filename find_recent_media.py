import os
from PIL import Image

temp_dir = r"C:\Users\moren\.gemini\antigravity-ide\brain\4e24221a-dead-43f1-8f82-290dfa348f91\.tempmediaStorage"
for f in os.listdir(temp_dir):
    if f.startswith("media_1788165"):
        path = os.path.join(temp_dir, f)
        try:
            im = Image.open(path)
            print(f, im.size, im.format)
        except Exception as e:
            print(f, "Error:", e)
