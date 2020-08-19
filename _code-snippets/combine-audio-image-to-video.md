---
layout: snippet
title: Combine an audio file and a static image into a video
tags:
  - bash
  - linux
  - ffmpeg
language: bash
variables:
  Input Photo:
    replace: image.jpg
  Input Video:
    replace: audio.wav
  Output file:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: out.mp4
    #attrs:
    #  min: '2020-08-01'
---

```bash
ffmpeg -loop 1 -i image.jpg -i audio.wav \
    -c:v libx264 -tune stillimage \
    -c:a aac -b:a 192k -pix_fmt yuv420p -shortest \
    out.mp4
```

via <https://superuser.com/a/1041818/91462>