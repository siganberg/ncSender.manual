#!/bin/bash
# distinct decoded frames per second (exact hash), which catches duplicated frames without discarding subtle motion
for f in "$@"; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  n=$(ffmpeg -v error -i "$f" -an -f framemd5 - | grep -v "^#" | wc -l | tr -d ' ')
  u=$(ffmpeg -v error -i "$f" -an -f framemd5 - | grep -v "^#" | awk '{print $NF}' | uniq | wc -l | tr -d ' ')
  printf "%6.1f distinct fps  %5.1fs  frames %5s distinct %5s  %s\n" "$(echo "$u/$d" | bc -l)" "$d" "$n" "$u" "$f"
done
