from PIL import Image

# Open authentic inner box photo
img = Image.open('photos/box packaging/WhatsApp Image 2026-08-31 at 1.34.32 PM (1).jpeg')
w, h = img.size

# Tissue paper region in the photo:
# x: ~16% to 92%, y: ~56% to 96%
box_tissue = img.crop((int(w * 0.165), int(h * 0.555), int(w * 0.925), int(h * 0.965)))
tw, th = box_tissue.size

# Top flap (from top to horizontal seam around y=48%)
top_flap = box_tissue.crop((0, 0, tw, int(th * 0.50)))
top_flap = top_flap.resize((1024, 512), Image.Resampling.LANCZOS)
top_flap.save('public/textures/tissue_flap_top.jpg', quality=95)

# Bottom flap (from horizontal seam to bottom, containing the seal)
bottom_flap = box_tissue.crop((0, int(th * 0.46), tw, th))
bottom_flap = bottom_flap.resize((1024, 512), Image.Resampling.LANCZOS)
bottom_flap.save('public/textures/tissue_flap_bottom.jpg', quality=95)

# Full tissue texture
full_tissue = box_tissue.resize((1024, 768), Image.Resampling.LANCZOS)
full_tissue.save('public/textures/tissue_full_horizontal.jpg', quality=95)

print("Horizontal tissue flap textures generated successfully.")
