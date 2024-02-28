---
layout: snippet
title: Parse the current webpage's query string
tags:
  - javascript
language: js
variables:
---

```js
function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}
```
Use: 

{:.ignore}
```js
var query = parseQuery(document.location.search);
console.log(query.q);
```