---
layout: snippet
title: Combine an audio and video track in ffmpeg
tags:
  - bash
  - linux
  - ffmpeg
language: bash
variables:
  $VIDEO_FILE:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $VIDEO_FILE
    #attrs:
    #  min: '2020-08-01'
  $AUDIO_FILE:
    replace: $AUDIO_FILE
---

<https://superuser.com/a/277667>

```bash
ffmpeg -i $VIDEO_FILE -i $AUDIO_FILE -c:v copy -c:a aac output.mp4
```

### Combine without re-encoding (if using container output)

{:.ignore}
```bash
ffmpeg -i $VIDEO_FILE -i $AUDIO_FILE -c copy output.mkv
```

### Combine and replace existing audio in video file

{:.ignore}
```bash
ffmpeg -i $VIDEO_FILE -i $AUDIO_FILE -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4
```