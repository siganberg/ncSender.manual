#!/usr/bin/env python3
"""List every media file under docs/assets/images that has a "-light" twin.

Writes docs/assets/js/theme-media.json, which assets/js/theme-media.js reads
to swap screenshots and clips when the reader switches the manual to light
mode. Run it after adding or removing captures:

    python3 scripts/theme-media-manifest.py
"""
import json, os, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
images = os.path.join(root, 'assets', 'images')
out = os.path.join(root, 'assets', 'js', 'theme-media.json')
found = []
for dirpath, _, files in os.walk(images):
    names = set(files)
    for f in files:
        base, ext = os.path.splitext(f)
        if base.endswith('-light') or base.endswith('-light-poster'):
            continue
        twin = (base[:-7] + '-light-poster' + ext) if base.endswith('-poster') else (base + '-light' + ext)
        if twin in names:
            rel = os.path.relpath(os.path.join(dirpath, f), root).replace(os.sep, '/')
            found.append(rel)
found.sort()
with open(out, 'w') as fh:
    json.dump(found, fh, indent=0)
    fh.write('\n')
print(f'{len(found)} files with a light twin -> {os.path.relpath(out)}')
