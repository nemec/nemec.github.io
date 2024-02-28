---
layout: snippet
title: Navigate items on a page with arrow keys
tags:
  - tampermonkey
  - greasemonkey
  - javascript
language: js
variables:
---

Add the following to your Tampermonkey heading to add a library
for status notifications:

```
// @require      https://cdnjs.cloudflare.com/ajax/libs/snarl/0.3.4/snarl.min.js#sha512-edY+d/STgdRX3lJvE77T2hcUgysPZboIndHzPG/9+YjxRlDPAXaZy3EGP7wcet8kW8/pzsCzL06r3g91ml2E/A==
// @resource     SNARL_CSS https://cdnjs.cloudflare.com/ajax/libs/snarl/0.3.4/snarl.min.css#sha512-FabkUciv18DX/Pz+89FCNXMdpbA3Is8OAuwxkdQdyni4Y6gYcMjRSSxOiF3Cfyy0KtSMEyyjpYXfv/E3bDS+hg==
// @grant        GM_getResourceText
// @grant        GM_addStyle
```

Then add the following to your Tampermonkey script. Fill in your own code
for the methods `findElementsOnPage`, `findPermalinkInElem`,
`findDataInElem`, `findNextPageLink`, and `onOpenItem`.

```js
let style = GM_getResourceText("SNARL_CSS");
GM_addStyle(style);


function scrollTo(position, hash) {
    window.scroll({
        top: position,
        behavior: "smooth",
    });
    if (hash) {
        window.location.hash = hash;
    }
}

function isBottomOfElementVisible(currentElem, nextElem) {
    var rect = currentElem.getBoundingClientRect();
    var viewTop = window.scrollY;
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    let elementBottomPosition = nextElem ? nextElem.getBoundingClientRect().top : rect.bottom;
    if(window.debug) {
        console.log("view top: " + viewTop);
        console.log("view height: " + viewHeight);
        console.log("elem bottom: " + elementBottomPosition);
    }

    var below = elementBottomPosition - viewHeight >= 0;
    return !below;
}

(function() {
    'use strict';
    //window.debug = true;

    window.Snarl.setDefaultOptions({
        timeout: 1500,
    });

    var currentIndex = -1;
    var pageItems = [];
    var nextPageLink = null;

    // Return a list of DOM elements that will be transformed into "items"
    function findElementsOnPage() {
        return document.querySelectorAll(".container h2");
    }

    // Direct URL to item on page (if available)
    function findPermalinkInElem(elem) {
        return document.location.protocol + "//" + document.location.hostname + document.location.pathname + document.location.search + "#" + elem.id;
    }

    function findDataInElem(elem) {
        return null;
    }

    // Return a DOM element (<a>) matching the next page button, if one exists
    function findNextPageLink() {
        return null;
    }

    function onOpenItem(item) {
        window.Snarl.addNotification({
            text: "Copied link to clipboard"
        });
    }

    function parsePageItems() {
        let pageHash = document.location.hash;
        let elems = findElementsOnPage();
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];

            let item = {
                permalink: findPermalinkInElem(elem),
                elem,
                hash: null,
                data: findDataInElem(elem),
            };

            if (item.permalink && item.permalink.indexOf("#") >= 0) {
                item.hash = item.permalink.substring(item.permalink.indexOf("#"));
                if (item.hash === pageHash) {
                    currentIndex = i;
                }
            }
            pageItems[i] = item;
        }

        nextPageLink = findNextPageLink();

        if (window.debug) {
            console.log("Found " + pageItems.length + " items on page");
            if (nextPageLink !== null) {
                console.log("Next page link:");
                console.log(nextPageLink);
            } else {
                console.log("No next page link");
            }
        }
    }

    // Number of times you need to hit "next" at the end of the page to switch
    // to the next page. Intended to avoid accidentally going to next page when
    // just trying to scroll to the end of the current page.
    let nextBuffer = 1;
    function onNext() {
        let currentElem = pageItems[currentIndex].elem;
        let nextElem = currentIndex < pageItems.length - 1 ? pageItems[currentIndex + 1].elem : null;

        if(currentIndex >= 0 && !isBottomOfElementVisible(currentElem, nextElem)) {
            // Scroll a little bit until we hit the bottom of the element
            window.scrollBy({
                top: window.innerHeight * 0.6,
                behavior: "smooth",
            });
        } else {
            // Scroll to the next element
            if (currentIndex >= pageItems.length - 1) {
                if (nextPageLink !== null) {
                    if (nextBuffer > 0) {
                        nextBuffer--;
                    }
                    else if (nextBuffer === 0) {
                        window.Snarl.addNotification({
                            text: "End of page",
                            icon: '<span>🛑</span>',
                        });
                        nextBuffer--;
                    } else {
                        nextPageLink.click();
                    }
                    return;
                } else {
                        window.Snarl.addNotification({
                            text: "No next page",
                            icon: '<span>❌</span>',
                        });
                }
                return;
            }
            let nextItem = pageItems[currentIndex + 1];
            let position = nextItem.elem.offsetTop;
            scrollTo(position, nextItem.hash);
            currentIndex++;
        }
        nextBuffer = 1;
    }

    function onPrevious() {
        if (currentIndex <= 0) {
            // start of page
            return;
        }
        let previousItem = pageItems[currentIndex - 1];
        let position = previousItem.elem.offsetTop;
        scrollTo(previousItem.elem.offsetTop, previousItem.hash);
        currentIndex--;
    }

    parsePageItems();

    document.addEventListener("keydown", (event) => {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        if(event.keyCode == 39) { // right arrow
            onNext();
        } else if(event.keyCode === 37) { // left arrow
            onPrevious();
        } else if (event.keyCode === 13) {
            onOpenItem(pageItems[currentIndex]);
        }
    });
})();
```
