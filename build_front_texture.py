from PIL import Image

# Load real photo of front shirt
real_front = Image.open('photos/box packaging/WhatsApp Image 2026-08-31 at 1.34.50 PM.jpeg')
rw, rh = real_front.size

# 1. Crop chest text 'DRIP COSMOS' from real photo
# Text is located around x: 38% to 62%, y: 26% to 35%
chest_crop = real_front.crop((int(rw * 0.38), int(rh * 0.265), int(rw * 0.615), int(rh * 0.35)))
chest_crop = chest_crop.resize((980, 320), Image.Resampling.LANCZOS)

# 2. Crop hem label 'DC DRIP COSMOS LIMITED EDITION' from real photo
# Label is located around x: 62% to 70%, y: 80% to 86%
hem_crop = real_front.crop((int(rw * 0.622), int(rh * 0.806), int(rw * 0.698), int(rh * 0.858)))
hem_crop = hem_crop.resize((320, 150), Image.Resampling.LANCZOS)

# 3. Create clean off-white front canvas
front_canvas = Image.new('RGB', (2048, 2048), (242, 239, 224)) # #F2EFE0

# Paste chest text
front_canvas.paste(chest_crop, (1024 - chest_crop.width // 2, 660))

# Paste hem label
front_canvas.paste(hem_crop, (1500, 1720))

front_canvas.save('public/textures/shirt_master_front.png', quality=98)
print("Updated shirt_master_front.png with real photo elements")
