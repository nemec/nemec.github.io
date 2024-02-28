---
layout: snippet
title: Filter a list of elements on a webpage by a range of values (min/max)
tags:
  - tampermonkey
  - greasemonkey
  - javascript
language: js
variables:
---

```js
let allItems = document.querySelectorAll(".page-container");

function getListItemValue(item) {
    return item.querySelector(".size").innerText;
}

function filter(lowerLimit, upperLimit) {
    for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        var value = getListItemValue(item);
        if ((lowerLimit && value < lowerLimit) || (upperLimit && value > upperLimit)) {
            file.style = "display:none";
        } else {
            file.style = "";
        }
    }
}
```

```js
let container = document.createElement("div");
container.style = "position: fixed; top: 0; right: 0; z-index: 9999;";

let ll = document.createElement("input");
ll.placeholder = "Lower Limit";
ll.type = "number";
let ul = document.createElement("input");
ul.placeholder = "Upper Limit";
ul.type = "number";

let go = document.createElement("button");
go.innerText = "Filter";
go.onclick = function() {
    console.log("Filtering list by size " + (ll.value||"0") + " - " + (ul.value||"inf"));
    filter(ll.value, ul.value);
}

container.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        go.onclick();
    }
})

container.appendChild(ll);
container.appendChild(ul);
container.appendChild(go);
document.body.appendChild(container);
```
