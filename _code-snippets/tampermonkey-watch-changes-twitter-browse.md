---
layout: snippet
title: Monitor an SPA (like Twitter) and act when a certain page is loaded
tags:
  - tampermonkey
  - greasemonkey
  - javascript
language: js
variables:
---

```js
function addLikeLinks() {
    var items = document.querySelectorAll('div[data-testid="primaryColumn"] div[data-testid="UserCell"]:not([data-applied])');
    if (items.length === 0) {
        return;
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        
        // DOM element marker noting when we've modified this element.
        // The previous selector will filter out elements that have
        // already been tagged so we don't apply the changes multiple times.
        item.dataset.applied = "";

        var profileLink = item.querySelector('a');
        var link = profileLink.href;
        
        var newLink = document.createElement('a');
        profileLink.href = link + '/likes';
        newLink.href = link + '/likes';
        newLink.innerText = 'Likes';
        newLink.target="_blank";
        item.appendChild(newLink);
    }
}

var commentBox = null;

function findCommentBox() {
    if (commentBox !== null) return;
    commentBox = document.querySelector('div[data-testid="primaryColumn"] section div[aria-label="Timeline: Likes"]');
    // If the box isn't loaded yet, try again later
    if (commentBox === null) {
        setTimeout(findCommentBox, 1000);
        return;
    }
    addLikeLinks();
    // Monitor for changes in the list of users
    new MutationObserver(addLikeLinks).observe(
        commentBox,
        { subtree: true, characterData: true, childList: true }
    );
}

var callback = function (mutations) {
    let urlWeWant = /twitter.com\/.+\/status\/\d+\/likes/;
    if (urlWeWant.test(window.location.href)) {
        findCommentBox();
    }
}

var observer = new MutationObserver(callback);

function start() {
    var titleObj = document.querySelector('title');
    // Wait for the page's title to be set
    if (titleObj === null) {
        setTimeout(start, 1000);
        return;
    }
    callback();

    // Also execute callback whenever the page's title changes
    observer.observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    );
}
start();
```
