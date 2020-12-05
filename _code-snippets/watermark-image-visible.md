---
layout: snippet
title: Apply a visible watermark across the face of an image
tags:
  - bash
  - imagemagick
language: bash
variables:
  Image Path:
    replace: ~/image.png
  Message Line 1:
    replace: Stop
  Message Line 2:
    replace: Not For Sale
---

## Sources

<https://twitter.com/_trou_/status/1313951783182651393>

<https://github.com/troyane/Useful_Scripts/tree/main/sensitive>


## Example:

![](/images/2020/11/snippet-watermark.jpg)

```bash
image_path='~/image.png'
message_line_1='Stop'
message_line_2='Not For Sale'

# Get picture height
height="$(identify -ping -format '%h' ${image_path})"
# Calculate preferable text point size based on picture height 
preferablePointSize=$((height/11))
margin1=$((-1*preferablePointSize))
margin2=$((preferablePointSize/2))
directory="$(dirname "${image_path}")"
filename=$(basename -- "${image_path}")
extension="${filename##*.}"
filename="${filename%.*}"

output=${directory}/${filename}_stamped.${extension}

convert -density 150 \
        -fill "rgba(255,0,0,0.25)" \
        -gravity Center -pointsize "${preferablePointSize}" \
        -draw "rotate -45 text 0,${margin1} \"${message_line_1}\" text 0,${margin2} \"${message_line_2}\"" \
        "${image_path}" "${output}"

echo "Result saved to: ${output}"
```