---
layout: snippet
title: Monitor the response from an Ajax call
tags:
  - tampermonkey
  - greasemonkey
  - javascript
language: js
variables:
---

In this example, we'll watch for rate limit warnings and print the
time until the rate limit is reset to the console.

```js
(function(oldOpenFunc) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            try {
                var apiMatcher = /api\.twitter\.com.+\.json$/;

                if(apiMatcher.test(this.responseURL)) {
                    var remaining = this.getResponseHeader("x-rate-limit-remaining");
                    var resetDate = this.getResponseHeader("x-rate-limit-reset");
                    if(!!remaining && remaining <= 10) {
                        console.log("Reset time: " + resetDate);
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        }, false);
        oldOpenFunc.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);
```
