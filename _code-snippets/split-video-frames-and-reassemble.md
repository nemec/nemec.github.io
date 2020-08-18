---
layout: snippet
title: Split video into frames and then combine at 30fps
description: Split a video into multiple image frames and then reassemble frames
  into a movie again. Frames may be edited in between commands.
tags:
  - bash
  - linux
  - ffmpeg
language: bash
variables:
  $INPUT_FILE:
  $OUTPUT_FILE:
---

```bash
mkdir frames
ffmpeg -i $VIDEO_FILE frames/thumb%04d.jpg -hide_banner
ffmpeg -framerate 30 -pattern_type glob -i 'frames/*.jpg' -c:v libx264 -pix_fmt yuv420p $OUTPUT_FILE
```