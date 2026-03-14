"""Generate placeholder photo SVGs for each selectable FRAME module option."""
import os

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "photos")
os.makedirs(BASE_DIR, exist_ok=True)

# All selectable module options across wizard steps
MODULES = {
    # LightSource step
    "single-led": ("Single White LED", "#FFC107", "Bright white LED for standard brightfield."),
    "led-matrix": ("LED Matrix 8x8", "#FF9800", "NeoPixel programmable LED array."),
    "led-ring": ("LED Ring Koehler", "#FF5722", "Ring illumination with Koehler optics."),
    # Autofocus step
    "laser-astigmatism": ("Laser Autofocus", "#E91E63", "IR laser reflection AF system."),
    "image-contrast": ("Software Autofocus", "#9C27B0", "Contrast-based software AF."),
    # SampleHolder step
    "4-slide-insert": ("4-Slide Insert", "#795548", "Holds 4 standard microscope slides."),
    "wellplate-insert": ("Wellplate Insert", "#795548", "SBS wellplate holder."),
    # Objectives (generic)
    "objective-generic": ("Objective Lens", "#2196F3", "Microscope objective."),
    # Revolver
    "motorized-revolver": ("Objective Revolver", "#3F51B5", "Motorized 3-position turret."),
    # Overview camera
    "overview-camera": ("Overview Camera", "#9C27B0", "Wide-field overview camera."),
    # Fluorescence
    "fluorescence-laser": ("Fluorescence Laser", "#4CAF50", "Laser excitation source."),
    "fluorescence-led": ("Fluorescence LED", "#4CAF50", "LED excitation source."),
    # Camera (generic)
    "camera-generic": ("USB Camera", "#9C27B0", "CCTV/Industrial camera."),
    # Tube lens (generic)
    "tube-lens-generic": ("Tube Lens", "#00BCD4", "Focusing tube lens."),
    # Control inputs
    "ps4-joystick": ("PS4 Joystick", "#FF5722", "Wireless PS4 DualShock controller."),
    "can-jog-dial": ("CAN Jog Dial", "#FF5722", "Rotary encoder dial for Z-axis."),
    # Electronics
    "electronics-v3": ("UC2e Electronics", "#607D8B", "ESP32 main controller board."),
}

SVG_TEMPLATE = """\
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8f9fa"/>
      <stop offset="100%" stop-color="#e9ecef"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)" rx="8"/>
  <rect x="20" y="20" width="360" height="210" rx="8" fill="#fff" stroke="{color}" stroke-width="2"/>
  <circle cx="200" cy="110" r="50" fill="{color}" opacity="0.15"/>
  <text x="200" y="105" text-anchor="middle" fill="{color}" font-size="28" font-weight="bold" font-family="Arial">UC2</text>
  <text x="200" y="130" text-anchor="middle" fill="{color}" font-size="12" font-family="Arial">{name}</text>
  <rect x="40" y="180" width="320" height="30" rx="4" fill="{color}" opacity="0.1"/>
  <text x="200" y="200" text-anchor="middle" fill="#555" font-size="10" font-family="Arial">{desc}</text>
  <text x="200" y="260" text-anchor="middle" fill="#999" font-size="10" font-family="Arial">Placeholder photo - replace with actual product image</text>
  <text x="200" y="280" text-anchor="middle" fill="#bbb" font-size="9" font-family="Arial">{key}</text>
</svg>
"""

count = 0
for key, (name, color, desc) in MODULES.items():
    svg = SVG_TEMPLATE.format(key=key, name=name, color=color, desc=desc)
    fpath = os.path.join(BASE_DIR, f"{key}.svg")
    with open(fpath, "w") as f:
        f.write(svg)
    count += 1

print(f"Created {count} placeholder module photos in {BASE_DIR}")
