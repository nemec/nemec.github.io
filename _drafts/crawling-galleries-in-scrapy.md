---
layout: post
title: Crawling Galleries in Scrapy
description: Some description
tags:
  - python
  - web-scraping
---

When developing web-scraping projects, there is one pattern in particular
that I find myself needing to code for over and over - the 'gallery'. This
gallery is often a photo gallery, but can take many forms - as long as
it matches the pattern. In this post we will be crawling a Teespring gallery
for [products related to squirrels](https://teespring.com/search?q=squirrels).

We will be using the [Scrapy](https://scrapy.org/) web scraping
framework to develop the crawler and the Python module
[Requests](http://docs.python-requests.org/en/master/) to debug HTML selectors
used to extract information from the web page.

You may follow along with this post by cloning the [companion git
repository](https://github.com/nemec/scrapy-gallery-sample) and checking out
the appropriate commit. Every time you see the following git command, you may
execute it to jump to the exact commit and code I started with at that point
in the tutorial.

```bash
git checkout AAABBB
```

If you get lost and feel like you have "broken" too much code, there is no
shame in peeking ahead at the answers! Just run the command `git reset --hard` 
to undo all of your changes and then look for the next `git checkout` in the
tutorial. Run that and you can see what my project looked like after completing
that section. You could also run the command `git diff {previous} {next}`, where
`{previous}` and `{next}` are the two commit hashes (the hexadecimal, like
`48bb83`) you can find in the `git checkout` commands that come before and
after the section of tutorial you are stuck on - this will display the exact
changes I made between those two points.

## How do I know if I am crawling a gallery?

In my experience there are 3 different properties that define a gallery
pattern:

1. A landing page containing a grid or a list of links or thumbnails, each
linking to another page with more detail.

![landing page]({{ site.url }}/images/gallery-pattern-1.png)

2. A detail page containing all of the information you want to scrape from
the source.

![detail page]({{ site.url }}/images/gallery-pattern-2.png)

3. Optionally, the gallery is broken down into multiple pages, which requires
you to crawl each page in order to collect the complete set of information.

![paging]({{ site.url }}/images/gallery-pattern-3.png)

## Crawling a gallery

First off, if you are already proficient with Scrapy and web scraping in
general, you can skip [directly to the final code](). It is not particularly
complicated and I often simply copy-paste the contents of the spider and tweak
as needed each time I need to crawl a gallery.

[TODO]

```bash
git checkout 097e3c2
```

With Scrapy installed run the following commands to create a spider:

```bash
scrapy startproject gallery
cd gallery
scrapy genspider teespring teespring.com
```

```bash
git checkout a35ea50
```

When you open `gallery/spiders/teespring.py` you will notice that the
start URL is `http://teespring.com/`, not the gallery that we want to crawl.

```python
class TeespringSpider(scrapy.Spider):
    name = 'teespring'
    allowed_domains = ['teespring.com']
    start_urls = ['http://teespring.com/']

    def parse(self, response):
        pass
```

As far as I know, the default Scrapy template does not generate HTTPS URLs or
insert paths into the initial `start_urls` array, but that is easily fixed.
Property 1 that I identified above is the "landing page"; in Teespring's case
this is the search URL. Edit the spider property `start_urls` to the following
value:

```python
start_urls = ['https://teespring.com/search?q=squirrels']
```

```bash
git checkout 4002765
```

Once you have defined the landing page, it's time to work on crawling each
of the photos in the gallery. I prefer using [CSS selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors)
to extract sections of HTML when I can and Scrapy provides a very useful method
on the `response` object of the `parse` method in your crawler, `reponse.css()`,
which uses CSS selectors.

When developing my selectors, it is incredibly helpful to have a browser open
beside you with the dev tools open. Modern browser dev tools let you inspect
elements, poke through the HTML, and use the console to evaluate Javascript
in the context of the page.

What we are looking for now is a selector that will give us a URL to each
photo in the gallery on the page. Start by right clicking one of the images
and choosing 'Inspect' or 'Inspect Element' depending on your browser. This
will pop up the browser developer tools.

![inspect element]({{ site.url }}/images/gallery-inspect-element.png)

You can see in the image that the HTML element that is highlighted in blue
in the inspector is an `a` element - a link - and its `href` attribute is
the URL/path a specific photo in the gallery. This is exactly what we are
looking for, but it is not as simple as selecting all links on the page.
Elsewhere, there are links to the Teespring homepage, the Log In button, the
user's About page, and many others that we do not want to crawl.

One of the best techniques for choosing an appropriate selector parallels
the thought process of a web developer tasked with building a web page: use
classes to separate elements into logical groups based on their purpose on
the web page. Around this first inspected element it is clear there are a
lot of classes applied, are any of them usable in our crawler?

![inspect element]({{ site.url }}/images/gallery-inspect-element-class.png)

The best selector is one that is _specific_, but not too specific. If you are
too specific, you run the risk of matching on too few elements. For example,
in the image above we could match the URL we need on the ID
`yui_3_16_0_1_1529455494838_8571`, however comparing that ID to the IDs around
it, and the IDs on other gallery images on the page, you will see that it
matches only _one_ element when we need to match twenty-four! On the other hand,
many HTML classes will be too vague - the `view` class, for example, matches
a total of 42 elements. If we used `view`, we could end up with duplicate
matches or we could crawl non-photo pages which may introduce junk data into
out output. Another good tip for choosing a selector, if you are lucky enough
to have descriptive classes, is to pick one that somewhat describes the 'idea'
of what you want to isolate. In our case, we want to match on a 'photo' and
(after a bit of debugging) it turns out that the class
`photo-list-photo-view` is perfect 


### Interlude - Debugging Selectors

Since Scrapy does **not** execute Javascript when crawling the page, it is
possible for a selector you have developed to work in the browser but still fail
in Scrapy. Or, the web page could load new pages automatically when you scroll
down, something you would not be able to replicate without Javascript.
Therefore, it can be very helpful to have a Python interpreter open
in parallel to test your selectors as you go, without needing to fully run your
spider each time. This can be accomplished with a combination of Scrapy's
`Selector` class and the awesome `requests` module, which makes HTTP requests.
In your Python interpreter, run the following code to make a request to the
Teespring gallery and turn the response into an object you can run arbitrary
selectors against:

```python
import requests
from scrapy import Selector

resp = requests.get('https://teespring.com/search?q=squirrels')
s = Selector(text=resp.text)
print(s.css('.js-search-product-link').extract())
# prints:
# ['<a href="/shop/squirrel-bag-...
```

When dealing with a large amount of matched items, it could be helpful to
compare the count of items matched by your selector with the number of items
you _expect_ to see, such as counting the number of photos per page in
a Teespring gallery.

```python
print(s.css('.js-search-product-link').extract())
# 24
```

If you are working with some particularly hairy HTML selectors, using the
browser's built-in view-source button (which also shows the HTML without
any Javascript applied) may help you better visualize the HTML source.

![view source]({{ site.url }}/images/gallery-view-source.png)

Authentication with the site you are crawling is out of scope here, but you
may replace:

```python
resp = requests.get('https://teespring.com/search?q=squirrels')
```

with:

```python
sess = requests.Session()
# insert login code here

resp = sess.get('https://teespring.com/search?q=squirrels')
```

If you need to log in first. The session object will retain the cookies from
your attempt to log in, and the final `get` will use them to request the
gallery page.
[TODO]