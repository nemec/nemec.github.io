---
layout: snippet
title: Convert video to a Twitter-friendly format
description: Twitter does not support some video encodings
tags:
  - bash
  - linux
  - ffmpeg
language: bash
variables:
  $INPUT_FILE:
  $OUTPUT_FILE:
---

Simple, but with minimum modification:

```bash
ffmpeg -i "$INPUT_FILE" -pix_fmt yuv420p -vcodec libx264 "$OUTPUT_FILE"
```

Complex, but resizes the video and may better support odd encodings:

```bash
ffmpeg -i "$INPUT_FILE" \
  -pix_fmt yuv420p -vcodec libx264 \
  -vf scale=640:-1 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" \
  -acodec aac -vb 1024k \
  -minrate 1024k -maxrate 1024k -bufsize 1024k \
  -ar 44100 -ac 2 -strict experimental -r 30 \
  "$OUTPUT_FILE";
```