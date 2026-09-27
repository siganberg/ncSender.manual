#!/bin/bash
# unique-frame rate and black frames per clip
for f in "$@"; do
  n=$(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$f")
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  u=$(ffmpeg -nostats -i "$f" -vf "mpdecimate=hi=64*12:lo=64*5:frac=0.33,showinfo" -an -f null - 2>&1 | grep -c "showinfo.*n:")
  b=$(ffmpeg -nostats -i "$f" -vf "blackdetect=d=0.05:pix_th=0.10" -an -f null - 2>&1 | grep -c black_start)
  printf "%6.1f ufps %5.1fs frames %4s unique %4s black %s  %s\n" "$(echo "$u/$d" | bc -l)" "$d" "$n" "$u" "$b" "$f"
done
