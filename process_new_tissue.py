from PIL import Image

# Load the exact photo
img = Image.open('photos/box packaging/WhatsApp Image 2026-08-31 at 1.34.50 PM (1).jpeg')
print("Original size:", img.size)

# The image is 1207x1600 (vertical). In the user's prompt, the image is landscape with the hang tag at top right.
# Let's rotate 90 degrees clockwise or counterclockwise if needed:
# If width < height, rotate to landscape.
if img.width < img.height:
    img_rot = img.rotate(270, expand=True) # Try 270 (90 deg clockwise)
else:
    img_rot = img

print("Rotated size:", img_rot.size)

w, h = img_rot.size
# Let's save the full landscape image
img_rot.save('public/textures/tissue_full_reference.jpg', quality=95)

# The seam runs horizontally around y = 0.51 of the height
# Top flap: from y = 0 to y = 0.52
top_flap = img_rot.crop((0, 0, w, int(h * 0.52)))
top_flap = top_flap.resize((2048, 1024), Image.Resampling.LANCZOS)
top_flap.save('public/textures/tissue_flap_top.jpg', quality=95)

# Bottom flap: from y = 0.48 to y = h
bottom_flap = img_rot.crop((0, int(h * 0.48), w, h))
bottom_flap = bottom_flap.resize((2048, 1024), Image.Resampling.LANCZOS)
bottom_flap.save('public/textures/tissue_flap_bottom.jpg', quality=95)

# Full texture
full = img_rot.resize((2048, 1365), Image.Resampling.LANCZOS)
full.save('public/textures/tissue_full_horizontal.jpg', quality=95)

print("Generated top & bottom flaps with high resolution!")
