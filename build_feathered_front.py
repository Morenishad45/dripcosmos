
from PIL import Image, ImageFilter
import numpy as np

# Load real photo
real_front = Image.open('photos/box packaging/WhatsApp Image 2026-08-31 at 1.34.50 PM.jpeg').convert('RGBA')
rw, rh = real_front.size

# 1. Crop chest
chest_crop = real_front.crop((int(rw * 0.38), int(rh * 0.265), int(rw * 0.615), int(rh * 0.35)))
chest_crop = chest_crop.resize((980, 320), Image.Resampling.LANCZOS)

# Create feather mask for chest
mask = Image.new('L', chest_crop.size, 255)
# Feather the outer 30px
draw_mask = np.ones((chest_crop.height, chest_crop.width), dtype=np.float32)
pad = 35
for y in range(chest_crop.height):
    for x in range(chest_crop.width):
        dx = min(x, chest_crop.width - 1 - x)
        dy = min(y, chest_crop.height - 1 - y)
        d = min(dx, dy)
        if d < pad:
            draw_mask[y, x] = d / float(pad)

mask = Image.fromarray((draw_mask * 255).astype(np.uint8))
mask = mask.filter(ImageFilter.GaussianBlur(radius=8))
chest_crop.putalpha(mask)

# 2. Crop hem label
hem_crop = real_front.crop((int(rw * 0.622), int(rh * 0.806), int(rw * 0.698), int(rh * 0.858)))
hem_crop = hem_crop.resize((320, 150), Image.Resampling.LANCZOS)

# Sample exact background color from chest edge
bg_color = (239, 233, 217, 255) # exact sampled garment cotton tone

front_canvas = Image.new('RGBA', (2048, 2048), bg_color)
front_canvas.paste(chest_crop, (1024 - chest_crop.width // 2, 660), chest_crop)
front_canvas.paste(hem_crop, (1500, 1720))

front_canvas.convert('RGB').save('public/textures/shirt_master_front.png', quality=98)
print("Seamless feathered front texture created.")
