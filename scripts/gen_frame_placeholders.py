"""Generate placeholder SVG images for all FRAME configuration combos."""
import os

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "frame_configs")
os.makedirs(BASE_DIR, exist_ok=True)

LIGHT_SOURCES = {
    "none": "No Illumination",
    "singleled": "Single LED",
    "ledmatrix": "LED Matrix",
    "ledring": "LED Ring",
}
AUTOFOCUS = {
    "none": "No Autofocus",
    "laserastigmatism": "Laser AF",
    "imagecontrast": "Software AF",
}
FLUO = {
    "fluo": "Fluorescence",
    "nofluo": "No Fluorescence",
}
ILLU_COLORS = {
    "none": ("#666", "#999"),
    "singleled": ("#FFC107", "#FFE082"),
    "ledmatrix": ("#FF9800", "#FFCC80"),
    "ledring": ("#FF5722", "#FFAB91"),
}

SVG_TEMPLATE = """\
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8f9fa"/>
      <stop offset="100%" stop-color="#e9ecef"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="200" y="100" width="400" height="400" rx="12" fill="#fff" stroke="#1e4670" stroke-width="3"/>
  <line x1="333" y1="100" x2="333" y2="500" stroke="#e0e0e0" stroke-width="1"/>
  <line x1="467" y1="100" x2="467" y2="500" stroke="#e0e0e0" stroke-width="1"/>
  <line x1="200" y1="233" x2="600" y2="233" stroke="#e0e0e0" stroke-width="1"/>
  <line x1="200" y1="367" x2="600" y2="367" stroke="#e0e0e0" stroke-width="1"/>
  <rect x="220" y="120" width="120" height="90" rx="6" fill="{illu_c1}" opacity="0.7"/>
  <text x="280" y="155" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold" font-family="Arial">{illu_label}</text>
  <text x="280" y="175" text-anchor="middle" fill="#fff" font-size="9" font-family="Arial">Illumination</text>
  <circle cx="400" cy="300" r="40" fill="#2196F3" opacity="0.15" stroke="#2196F3" stroke-width="2"/>
  <text x="400" y="295" text-anchor="middle" fill="#2196F3" font-size="11" font-weight="bold" font-family="Arial">OBJ</text>
  <text x="400" y="312" text-anchor="middle" fill="#2196F3" font-size="9" font-family="Arial">Objective</text>
  <rect x="480" y="120" width="100" height="50" rx="6" fill="{af_color}" opacity="0.7"/>
  <text x="530" y="145" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">{af_label}</text>
  <rect x="220" y="420" width="360" height="60" rx="6" fill="{fluo_color}" opacity="0.5"/>
  <text x="400" y="455" text-anchor="middle" fill="#333" font-size="12" font-weight="bold" font-family="Arial">{fluo_label}</text>
  <rect x="480" y="370" width="100" height="70" rx="6" fill="#9C27B0" opacity="0.15" stroke="#9C27B0" stroke-width="1.5"/>
  <text x="530" y="405" text-anchor="middle" fill="#9C27B0" font-size="10" font-weight="bold" font-family="Arial">Camera</text>
  <rect x="640" y="200" width="80" height="60" rx="6" fill="#607D8B" opacity="0.3" stroke="#607D8B" stroke-width="1"/>
  <text x="680" y="235" text-anchor="middle" fill="#607D8B" font-size="9" font-weight="bold" font-family="Arial">UC2e</text>
  <text x="400" y="40" text-anchor="middle" fill="#1e4670" font-size="18" font-weight="bold" font-family="Arial">UC2 FRAME Configuration</text>
  <text x="400" y="62" text-anchor="middle" fill="#666" font-size="12" font-family="Arial">{illu_label} - {af_label} - {fluo_label}</text>
  <text x="400" y="570" text-anchor="middle" fill="#999" font-size="10" font-family="Arial">Placeholder - replace with actual render</text>
</svg>
"""

count = 0
for illu_key, illu_label in LIGHT_SOURCES.items():
    for af_key, af_label in AUTOFOCUS.items():
        for fluo_key, fluo_label in FLUO.items():
            c1, _ = ILLU_COLORS[illu_key]
            af_color = "#E91E63" if af_key != "none" else "#ccc"
            fluo_color = "#4CAF50" if fluo_key == "fluo" else "#ccc"

            svg = SVG_TEMPLATE.format(
                illu_c1=c1,
                illu_label=illu_label,
                af_color=af_color,
                af_label=af_label,
                fluo_color=fluo_color,
                fluo_label=fluo_label,
            )

            fname = f"frame_{illu_key}_{af_key}_{fluo_key}.svg"
            with open(os.path.join(BASE_DIR, fname), "w") as f:
                f.write(svg)
            count += 1

print(f"Created {count} placeholder SVG images in {BASE_DIR}")
