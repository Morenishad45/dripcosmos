from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('public/textures', exist_ok=True)

# 1. Build High-Res Front Shirt Texture (2048 x 2048)
front_canvas = Image.new('RGBA', (2048, 2048), (242, 239, 224, 255)) # Luxury Off-White Fabric #F2EFE0

# Load Front Graphic if available or extract from techpack
techpack = Image.open(r'C:\Users\moren\.gemini\antigravity-ide\brain\tempmediaStorage\media_1788164981550.png')
w, h = techpack.size
front_crop = techpack.crop((0, int(h * 0.12), int(w * 0.49), int(h * 0.95)))
# Extract chest text region from front_crop
fc_w, fc_h = front_crop.size
chest_crop = front_crop.crop((int(fc_w * 0.28), int(fc_h * 0.28), int(fc_w * 0.72), int(fc_h * 0.44)))
chest_crop = chest_crop.resize((1000, 360), Image.Resampling.LANCZOS)

# Extract hem label
hem_crop = front_crop.crop((int(fc_w * 0.70), int(fc_h * 0.85), int(fc_w * 0.88), int(fc_h * 0.94)))
hem_crop = hem_crop.resize((260, 110), Image.Resampling.LANCZOS)

# Extract collar inner label
collar_crop = front_crop.crop((int(fc_w * 0.42), int(fc_h * 0.10), int(fc_w * 0.58), int(fc_h * 0.18)))
collar_crop = collar_crop.resize((200, 90), Image.Resampling.LANCZOS)

# Paste onto front canvas
front_canvas.paste(chest_crop, (1024 - chest_crop.width // 2, 680), chest_crop if chest_crop.mode == 'RGBA' else None)
front_canvas.paste(hem_crop, (1580, 1780), hem_crop if hem_crop.mode == 'RGBA' else None)
front_canvas.paste(collar_crop, (1024 - collar_crop.width // 2, 280), collar_crop if collar_crop.mode == 'RGBA' else None)
front_canvas.save('public/textures/shirt_master_front.png', quality=98)
print("Saved shirt_master_front.png")

# 2. Build High-Res Back Shirt Texture (2048 x 2048)
back_canvas = Image.new('RGBA', (2048, 2048), (242, 239, 224, 255))

# Load Master Eagle Artwork (photos/DRIP COSMOS FINAL VARIATION 3.png)
master_eagle_path = 'photos/DRIP COSMOS FINAL VARIATION 3.png'
if os.path.exists(master_eagle_path):
    eagle_img = Image.open(master_eagle_path)
    # Resize eagle masterpiece to fit back canvas elegantly (e.g. 1500 x 1500)
    eagle_img.thumbnail((1550, 1550), Image.Resampling.LANCZOS)
    
    # Paste centered on back canvas
    ex = 1024 - eagle_img.width // 2
    ey = 480
    back_canvas.paste(eagle_img, (ex, ey), eagle_img if eagle_img.mode == 'RGBA' else None)
    print("Embedded master eagle artwork into back canvas")

# Load DC neck logo if available
dc_logo_path = 'photos/DRIP COSMOS FINAL VARIATION DC.png'
if os.path.exists(dc_logo_path):
    dc_logo = Image.open(dc_logo_path)
    dc_logo.thumbnail((180, 180), Image.Resampling.LANCZOS)
    back_canvas.paste(dc_logo, (1024 - dc_logo.width // 2, 220), dc_logo if dc_logo.mode == 'RGBA' else None)
    print("Embedded DC neck logo")

back_canvas.save('public/textures/shirt_master_back.png', quality=98)
print("Saved shirt_master_back.png")
