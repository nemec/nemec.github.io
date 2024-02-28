---
layout: snippet
title: Inject a download button onto a webpage
tags:
  - tampermonkey
  - greasemonkey
  - javascript
language: js
variables:
---

```js
let targetDownloadLink = document.querySelector("video source").src;

let container = document.createElement("div");
container.style = "position: fixed; top: 0; right: 0; z-index: 2000;";
let dl = document.createElement("a");
dl.innerText = "Download";
dl.target = "_blank";
dl.onclick = (function(e) {
    navigator.clipboard.writeText(targetDownloadLink);
});
container.appendChild(dl);
document.body.appendChild(container);
```
