---
layout: snippet
title: Inject buttons onto a webpage to enumerate prev/next page
tags:
  - tampermonkey
  - greasemonkey
  - javascript
language: js
variables:
---

```js
let hostname = document.location.protocol + "//" + document.location.hostname;

// List of tuples of:
//   1. Regex matching "page number" in URL (must be number)
//   2. Destination path - final URL will append hostname, path, and next/prev page number
let pageTypes = [
    [/page_num=(\d+)/g, "/pages?page_num="],
];

function parseIdx(url, matcher) {
    if (!url) return null;

    let match = [...url.matchAll(matcher)];
    if (match.length > 0) {
        let arr = match[0];
        if (arr.length > 1) {
            return parseInt(arr[1]);
        }
    }
    return null;
}

function tryMatchPageData(currentUrl) {
    for (let i = 0; i < pageTypes.length; i++) {
        let [matcher, path] = pageTypes[i];
        let idx = parseIdx(currentUrl, matcher);
        if (idx) {
            return [matcher, path, idx];
        }
    }
    return [false, false, false];
}

let currentUrl = document.location.href;
let [matcher, path, currentIdx] = tryMatchPageData(currentUrl);
if (!matcher) {
    console.log("No URL match found");
    return;
}
let baseUrl = hostname + path;
console.log("current idx: " + currentIdx);

let container = document.createElement("div");
container.style = "position: fixed; top: 0; right: 0; z-index: 1000";
let prev = document.createElement("button");
prev.innerText = "Prev";
prev.onclick = function() {
    console.log(baseUrl+ (currentIdx - 1));
    document.location = baseUrl + (currentIdx - 1);
}
let next = document.createElement("button");
next.innerText = "Next";
next.onclick = function() {
    console.log(baseUrl + (currentIdx + 1));
    document.location = baseUrl + (currentIdx + 1);
}

container.appendChild(prev);
container.appendChild(next);
document.body.appendChild(container);

// Did we change pages?
let previousPageIdx = parseIdx(document.referrer, matcher);
if (previousPageIdx) {
    console.log("previous page idx: " + previousPageIdx);

    // Boolean to check whether the new page index is valid.
    // If not, we'll automatically continue searching the prev/next index.
    let thisPageContainsData = document.querySelectorAll(".thumbnail").length > 0;
    if (!thisPageContainsData) {
        console.log("No data found on this index. Going to next.");
        if (currentIdx < previousPageIdx) {
            prev.onclick();
        } else if (previousPageIdx < currentIdx) {
            next.onclick();
        }
    }
}
```
