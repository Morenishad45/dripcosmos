import os
from PIL import Image

img_path = 'photos/box packaging/packaging paper image.png'
img = Image.open(img_path)
print("Original size:", img.size, img.mode)

# Convert to RGB if saving as JPG, or save as PNG to preserve exact colors/alpha
if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
    # Convert RGBA background to white if alpha exists, or keep RGB
    background = Image.new('RGB', img.size, (235, 233, 227))
    if img.mode == 'RGBA':
        background.paste(img, mask=img.split()[3])
    else:
        background.paste(img)
    img_rgb = background
else:
    img_rgb = img.convert('RGB')

w, h = img_rgb.size
print("Processed image RGB size:", w, h)

# Save full texture
img_rgb.save('public/textures/tissue_full_horizontal.jpg', quality=98)

# The seam runs horizontally across the middle (around y = 0.50 - 0.52)
# Top flap: from y = 0 to y = int(h * 0.53) for realistic center overlap
top_flap = img_rgb.crop((0, 0, w, int(h * 0.53)))
top_flap = top_flap.resize((2048, 1024), Image.Resampling.LANCZOS)
top_flap.save('public/textures/tissue_flap_top.jpg', quality=98)

# Bottom flap: from y = int(h * 0.47) to y = h for realistic center overlap
bottom_flap = img_rgb.crop((0, int(h * 0.47), w, h))
bottom_flap = bottom_flap.resize((2048, 1024), Image.Resampling.LANCZOS)
bottom_flap.save('public/textures/tissue_flap_bottom.jpg', quality=98)

print("Successfully generated high-definition top & bottom flaps from 'packaging paper image.png'!")
