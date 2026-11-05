"""ncWirelessIO v1.1 manual figures, cut from the top-view render.

    uv run --with pillow python scripts/ncwirelessio-v1.1-figures.py <top-view.png>

Coordinates are in the 859 x 815 render; a bigger export of the same view
works too (everything is scaled to its width).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parent.parent / "docs/assets/images/accessories"
ORANGE = (247, 116, 22, 255)
INK = (54, 65, 84, 255)
GREY = (120, 128, 140, 255)
WHITE = (253, 253, 253, 255)
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

src = Image.open(sys.argv[1]).convert("RGBA")
K = src.width / 859

# The white around the board becomes transparent.
_mask = src.convert("RGB")
for corner in [(0, 0), (src.width - 1, 0), (0, src.height - 1), (src.width - 1, src.height - 1)]:
    ImageDraw.floodfill(_mask, corner, (255, 0, 255), thresh=40)
# ... and so do the four mounting holes (white, near the corners).
for cx, cy in [(0, 0), (1, 0), (0, 1), (1, 1)]:
    for dy in range(20, 85, 4):
        for dx in range(20, 85, 4):
            x = round((dx if cx == 0 else 859 - dx) * K)
            y = round((dy if cy == 0 else 815 - dy) * K)
            if min(_mask.getpixel((x, y))) > 235:
                ImageDraw.floodfill(_mask, (x, y), (255, 0, 255), thresh=40)
_bg = Image.eval(_mask.split()[1], lambda v: 255 if v == 0 else 0).filter(ImageFilter.MaxFilter(3))
src.putalpha(Image.eval(_bg, lambda v: 255 - v))


def font(size, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_REG, round(size))


def crop(box, s):
    """A piece of the render, scaled s times (render coordinates)."""
    x0, y0, x1, y1 = [round(v * K) for v in box]
    im = src.crop((x0, y0, x1, y1))
    w, h = round((box[2] - box[0]) * s), round((box[3] - box[1]) * s)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
    return im


class Fig:
    """A canvas with a board piece pasted at (ox, oy); pt() maps render coordinates."""

    def __init__(self, box, s, size, at):
        self.box, self.s, self.ox, self.oy = box, s, at[0], at[1]
        self.im = Image.new("RGBA", size, (0, 0, 0, 0))
        self.im.alpha_composite(crop(box, s), at)
        self.d = ImageDraw.Draw(self.im)

    def pt(self, x, y):
        return (self.ox + (x - self.box[0]) * self.s, self.oy + (y - self.box[1]) * self.s)

    def shunt(self, a, b, pad=11):
        """Orange outline round two pins: where the jumper shunt goes."""
        (x0, y0), (x1, y1) = self.pt(*a), self.pt(*b)
        p = pad * self.s / 4 * 2.2
        self.d.rounded_rectangle([min(x0, x1) - p, min(y0, y1) - p, max(x0, x1) + p, max(y0, y1) + p],
                                 radius=p * 0.7, outline=ORANGE, width=round(self.s * 1.6))

    def badge(self, x, y, text, size=None):
        size = size or self.s * 7
        cx, cy = self.pt(x, y)
        r = size * 0.62
        self.d.rounded_rectangle([cx - r, cy - r, cx + r, cy + r], radius=r * 0.3, fill=WHITE)
        self.d.text((cx, cy), text, fill=INK, font=font(size), anchor="mm")

    def wire(self, pts, color, width=None):
        width = width or round(self.s * 2.2)
        self.d.line(pts, fill=(30, 34, 40, 255), width=width + 4, joint="curve")
        self.d.line(pts, fill=color, width=width, joint="curve")

    def label(self, cx, cy, title, sub=None, w=None, size=26):
        f, fs = font(size), font(size * 0.62, bold=False)
        w = w or max(self.d.textlength(title, font=f), self.d.textlength(sub or "", font=fs)) + size * 1.6
        h = size * (2.6 if sub else 1.7)
        self.d.rounded_rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], radius=size * 0.35, fill=WHITE)
        if sub:
            self.d.text((cx, cy - size * 0.38), title, fill=INK, font=f, anchor="mm")
            self.d.text((cx, cy + size * 0.62), sub, fill=GREY, font=fs, anchor="mm")
        else:
            self.d.text((cx, cy), title, fill=INK, font=f, anchor="mm")
        return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)

    def save(self, name):
        bb = self.im.getbbox()
        self.im.crop(bb).save(OUT / f"ncwirelessio-v1.1-{name}.webp", quality=90, method=6)


def panels(name, box, s, items, title_size):
    """Side-by-side copies of one jumper, each with a title and its shunt."""
    pw, ph = round((box[2] - box[0]) * s), round((box[3] - box[1]) * s)
    th = round(title_size * 1.7)
    probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    cw = max(pw, *(probe.textlength(t, font=font(title_size)) + title_size for t, _, _ in items))
    gap = round(pw * 0.14)
    cw = round(cw)
    im = Image.new("RGBA", (len(items) * cw + (len(items) - 1) * gap, ph + th), (0, 0, 0, 0))
    for i, (title, a, b) in enumerate(items):
        f = Fig(box, s, (pw, ph), (0, 0))
        f.shunt(a, b)
        x = i * (cw + gap)
        im.alpha_composite(f.im, (x + (cw - pw) // 2, th))
        ImageDraw.Draw(im).text((x + cw / 2, th / 2), title, fill=ORANGE, font=font(title_size), anchor="mm")
    im.save(OUT / f"ncwirelessio-v1.1-{name}.webp", quality=90, method=6)


# --- pins (render coordinates) ---------------------------------------------
INSEL = {"5": 73.8, "24": 102.5, "12": 130.8}, (479, 507.5)
COM_X, COM_Y = 82, (630, 659.5, 687.5)          # GND, COM, V+
OUTSEL_X = {4: (182.3, 211), 3: (274, 303.3), 2: (366, 395.7), 1: (458.3, 486.7)}
OUTSEL_Y = {"12": 143.3, "24": 172, "5": 200.3}
OUT_SCREW_X = {4: (177.7, 216.7), 3: (269.5, 308.5), 2: (361.3, 400.3), 1: (452.7, 492.3)}
OUT_SCREW_Y = 60
IN_SCREW_X = [(138.5 + 129.3 * i, 178.5 + 129.3 * i, 218.5 + 129.3 * i) for i in range(4)]
IN_SCREW_Y = 752.5
STRIP_Y = {"GND": 310, "DAT": 332.7, "12V": 355.7}

# Sensor supply jumper: 5 / 24 / 12 V.
ix, (r0, r1) = INSEL
panels("insel", (50, 446, 156, 526), 4, [
    ("5 V", (ix["5"], r1), (ix["24"], r1)),
    ("24 V", (ix["24"], r0), (ix["24"], r1)),
    ("12 V", (ix["24"], r1), (ix["12"], r1)),
], 46)

# INPUT COM: NPN / PNP.
gnd, com, vplus = COM_Y
panels("com", (52, 606, 112, 726), 4, [
    ("NPN sensors", (COM_X, com), (COM_X, vplus)),
    ("PNP sensors · switches", (COM_X, gnd), (COM_X, com)),
], 34)

# Output voltage jumper (OUT1): 12 / 24 / 5 V.
l, r = OUTSEL_X[1]
panels("outsel", (424, 126, 504, 216), 4, [
    ("12 V", (r, OUTSEL_Y["12"]), (r, OUTSEL_Y["24"])),
    ("24 V", (l, OUTSEL_Y["24"]), (r, OUTSEL_Y["24"])),
    ("5 V", (r, OUTSEL_Y["24"]), (r, OUTSEL_Y["5"])),
], 46)

# Input terminals with G S V on INPUT 1.
s = 2.6
f = Fig((112, 572, 634, 798), s, (round(522 * s), round(226 * s)), (0, 0))
for x, t in zip(IN_SCREW_X[0], "GSV"):
    f.badge(x, IN_SCREW_Y + 25, t, size=26)
f.save("inputs")

# Output terminals with − + on each.
s = 2.5
f = Fig((152, 0, 516, 322), s, (round(364 * s), round(322 * s)), (0, 0))
for n, (a, b) in OUT_SCREW_X.items():
    f.badge(a, OUT_SCREW_Y + 30, "−", size=24)
    f.badge(b, OUT_SCREW_Y + 30, "+", size=24)
f.save("outputs")

# Sensor wiring: COM jumper + INPUT 1, wires down to a label.
WIRE = {"blue": (40, 110, 230, 255), "black": (40, 40, 44, 255), "brown": (150, 95, 40, 255),
        "red": (215, 45, 45, 255), "white": (240, 240, 240, 255), "green": (40, 170, 80, 255)}


def sensor(name, shunt, wires, title, sub):
    s = 3
    box = (55, 600, 245, 800)
    f = Fig(box, s, (round(190 * s), round(200 * s) + 330), (0, 0))
    f.shunt(*shunt)
    bottom = f.pt(0, box[3])[1]
    for i, (screw, color, tag) in wires.items():
        x, y = f.pt(IN_SCREW_X[0][i], IN_SCREW_Y)
        f.wire([(x, y), (x, bottom + 150)], WIRE[color])
        if tag:
            f.d.rounded_rectangle([x - 42, bottom + 50, x + 42, bottom + 90], radius=7, fill=WHITE)
            f.d.text((x, bottom + 70), tag, fill=INK, font=font(25), anchor="mm")
    cx = f.pt(IN_SCREW_X[0][1], 0)[0]
    f.label(cx, bottom + 225, title, sub, w=480, size=44)
    f.save(name)


sensor("npn", ((COM_X, com), (COM_X, vplus)),
       {0: (0, "blue", "blue"), 1: (1, "black", "black"), 2: (2, "brown", "brown")},
       "NPN sensor", "3-wire, e.g. inductive prox")
sensor("pnp", ((COM_X, gnd), (COM_X, com)),
       {0: (0, "blue", "blue"), 1: (1, "black", "black"), 2: (2, "brown", "brown")},
       "PNP sensor", "3-wire, e.g. inductive prox")
sensor("switch", ((COM_X, gnd), (COM_X, com)),
       {1: (1, "black", None), 2: (2, "red", None)},
       "Switch", "limit, reed, pressure")

# Air solenoid on OUT1 at 24 V: wires up to a label.
s = 3
box = (424, 0, 520, 222)
f = Fig(box, s, (round(96 * s) + 560, round(222 * s) + 300), (0, 300))
l, r = OUTSEL_X[1]
f.shunt((l, OUTSEL_Y["24"]), (r, OUTSEL_Y["24"]))
lb = f.label(f.im.width - 270, 100, "24 V solenoid", "valve coil", w=500, size=44)
for x, color, ty in [(OUT_SCREW_X[1][0], (200, 200, 205, 255), 75), (OUT_SCREW_X[1][1], WIRE["red"], 125)]:
    px, py = f.pt(x, OUT_SCREW_Y)
    f.wire([(px, py), (px, ty), (lb[0], ty)], color)
f.label(f.im.width - 270, 200, "either wire to either screw", w=500, size=28)
f.save("solenoid")

# LED strip: wires out to the right.
s = 3
box = (650, 284, 832, 392)
f = Fig(box, s, (round(182 * s) + 430, round(108 * s)), (0, 0))
lb = f.label(f.im.width - 200, f.pt(0, STRIP_Y["DAT"])[1], "12 V WS2811 strip", "input end", w=380, size=34)
for pin, color in [("GND", "white"), ("DAT", "green"), ("12V", "red")]:
    x0, y = f.pt(820, STRIP_Y[pin])
    f.wire([(x0, y), (lb[0] - 40, y), (lb[0], y)], WIRE[color])
f.save("strip")

# Power: supply to PWR IN.
s = 3
box = (34, 86, 176, 290)
f = Fig(box, s, (round(142 * s) + 330, round(204 * s)), (330, 0))
lb = f.label(150, f.pt(0, 213)[1], "Power supply", "24–48 V DC", w=290, size=40)
for y, color in [(192, WIRE["red"]), (236, (40, 40, 44, 255))]:
    x1, py = f.pt(44, y)
    f.wire([(lb[2], py), (x1, py)], color)
f.save("power")
print("ok")
