from PIL import Image, ImageOps
import os

photos_dir = "photos/box packaging"
output_dir = "public/textures"
os.makedirs(output_dir, exist_ok=True)

# 1. Outer Box Lid (WhatsApp Image 2026-08-31 at 1.34.32 PM.jpeg)
lid_img_path = os.path.join(photos_dir, "WhatsApp Image 2026-08-31 at 1.34.32 PM.jpeg")
if os.path.exists(lid_img_path):
    img = Image.open(lid_img_path)
    w, h = img.size
    # Crop tightly inside the box surface to remove any black background bleed
    box_crop = img.crop((int(w * 0.155), int(h * 0.125), int(w * 0.842), int(h * 0.855)))
    box_crop.save(os.path.join(output_dir, "box_lid_photo.jpg"), quality=98)
    print("Saved clean box_lid_photo.jpg", box_crop.size)

# 2. Inner Lid & Tissue (WhatsApp Image 2026-08-31 at 1.34.32 PM (1).jpeg)
open_box_path = os.path.join(photos_dir, "WhatsApp Image 2026-08-31 at 1.34.32 PM (1).jpeg")
if os.path.exists(open_box_path):
    img = Image.open(open_box_path)
    w, h = img.size
    
    # Inner lid: top half inside the box lid frame
    inner_lid_crop = img.crop((int(w * 0.152), int(h * 0.035), int(w * 0.815), int(h * 0.415)))
    inner_lid_crop.save(os.path.join(output_dir, "box_inner_lid_photo.jpg"), quality=98)
    print("Saved clean box_inner_lid_photo.jpg", inner_lid_crop.size)

    # Full Tissue Paper
    tissue_crop = img.crop((int(w * 0.150), int(h * 0.455), int(w * 0.820), int(h * 0.865)))
    tissue_crop.save(os.path.join(output_dir, "tissue_paper_photo.jpg"), quality=98)
    print("Saved clean tissue_paper_photo.jpg", tissue_crop.size)

    # Left & Right / Top & Bottom Tissue flaps
    tw, th = tissue_crop.size
    tissue_left = tissue_crop.crop((0, 0, int(tw * 0.52), th))
    tissue_right = tissue_crop.crop((int(tw * 0.48), 0, tw, th))
    tissue_left.save(os.path.join(output_dir, "tissue_flap_left.jpg"), quality=98)
    tissue_right.save(os.path.join(output_dir, "tissue_flap_right.jpg"), quality=98)
    print("Saved tissue flap textures")

# 3. Real Shirt Front and Back Photos
shirt_front_path = os.path.join(photos_dir, "WhatsApp Image 2026-08-31 at 1.34.50 PM.jpeg")
if os.path.exists(shirt_front_path):
    img = Image.open(shirt_front_path)
    w, h = img.size
    # Crop shirt front cleanly
    front_crop = img.crop((int(w * 0.11), int(h * 0.06), int(w * 0.89), int(h * 0.93)))
    front_crop.save(os.path.join(output_dir, "shirt_front_photo.jpg"), quality=98)
    print("Saved clean shirt_front_photo.jpg", front_crop.size)

shirt_back_path = os.path.join(photos_dir, "WhatsApp Image 2026-08-31 at 1.34.50 PM (1).jpeg")
if os.path.exists(shirt_back_path):
    img = Image.open(shirt_back_path)
    w, h = img.size
    # Crop shirt back cleanly
    back_crop = img.crop((int(w * 0.03), int(h * 0.13), int(w * 0.97), int(h * 0.87)))
    back_crop.save(os.path.join(output_dir, "shirt_back_photo.jpg"), quality=98)
    print("Saved clean shirt_back_photo.jpg", back_crop.size)

print("Updated all photo textures.")
