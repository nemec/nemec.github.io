---
layout: snippet
published: false # REMOVE ME
title: Fixup video metadata with ffmpeg after combining MPEG-TS parts
description: Some description
tags:
  - bash
  - linux
language: bash
variables:
  $FILENAME:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $FILENAME
    #attrs:
    #  min: '2020-08-01'
---

<https://forum.videohelp.com/threads/407804-yt-dlp-fixupm3u8>

This is the process used by yt-dlp to repair an MPEG-TS file after combining
its parts

```bash
ffmpeg -i $FILENAME -movflags +faststart -vcodec copy -acodec copy -absf aac_adtstoasc output.mp4
```