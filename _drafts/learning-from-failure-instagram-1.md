---
layout: post
title: "Learning From Failure: An Instagram Investigation Part 1"
description: Some description
shortlink: https://on.nem.ec/22xvXPo
category: programming
tags:
  - webscraping
  - osint
  - instagram
headerImage: autumn-path.jpg  # hieroglyphics
headerImageAttrib: freebigpictures.com
---

header:
https://pixabay.com/photos/aztec-pre-columbian-mexico-peru-195134/
https://www.shutterstock.com/image-vector/ancient-egypt-background-hieroglyph-symbolancient-culture-1220100472
https://www.shutterstock.com/image-vector/egyptian-gods-pharaohs-seamless-pattern-hieroglyphic-703830751
https://pixabay.com/photos/egypt-thebes-medinet-habu-temple-3304714/
https://pixabay.com/photos/egypt-luxor-hieroglyphics-wall-3508304/


Audience: Non-programmer, but tech savvy enough to understand HTML and maybe JSON


- Part 1
  - Intro
  - Colombia
  - Neighborhood-level mapping
  - What I failed to find
  - What I can learn from the data
  - What data I should collect next
- Part 2
  - Recap
  - USA
  - What I failed to find (Las Vegas, Protests)
    - Investigate "cap" on # of results from Instagram location directory
  - What I can learn from the data
  - Stats on % of popular hashtags having locations (collect this data)
- Part 3?
  - Recap
  - Collect data on a Middle East country
  - What I can learn from the data
- Part 4
  - Recap
  - Dive into technical details
  - Won't share code or data
  - Scrapy, authentication, sockpuppet, proxying
  - When things go wrong (404, 429, power/internet outage)
  - Dead letter queue
  - Logging
  - Intelligent restart, pick up where left off
  - Database, postgis
  - Visualizer, Mapbox
  - Code reuse
  - Conclusion


While looking for ways to sharpen my OSINT skills, I came across
an individual who had escaped custody in Colombia and was on the
run from the police. Local newspapers had mentioned that he once
ran an illegal business with a web presence, so I set out to see
if I could find anything interesting on his current whereabouts.
After doing some research, I learned that the man had been on
the run for about two years after being imprisoned since 2014.

Many of his lower-level business associates were fairly easy to
track down thanks to their use of social media (Facebook and 
Instagram in particular), but his more dependable confederates
proved much harder to identify and locate. Via court records, I found the address of his initial arrest - a lovely farm east of
Medellín. Thanks to social media, I also pinpointed a different
farm up north where two of his associates had both visited on
different days and within 

Before I move on, I'd like to skip to the unfortunate conclusion -
this is not a success story. Unfortunately, neither of the leads
ended up generating further insights due to various issues, to
be discussed further later. That said, while most investigations
aim to reach a "destination", there are still many lessons to
learn from on the way. In the posts that follow, I will
cover the motivation for scraping Instagram location data,
what I did and did not find in the data, and how the data can be
leveraged to improve further OSINT investigations.

, but it is a tale of how you can
turn a dead-end lead into useful knowledge that can be applied
to other investigations.


Social media is a **** for most Open Source Intelligence (OSINT) researchers.

I'll present a use case for data scraped from Instagram locations, plus some
statistical findings from the data and how it could be used (although those
findings might not be applicable to OSINT)

First, let's dive into what, exactly, makes up an instagram location.
https://havecamerawilltravel.com/photographer/instagram-location-search/


I beiefly explained on twitter...
one thing this example teaches: different languages, different cultures could
be posting to entirely separate locations than those you would normally monitor.
You may be missing out on a treasure trove of intelligence hidden beneath
Instagram's surface.

Why go to all this trouble creating our own dataset when we have many
search engines and tools at our disposal?
one simple question: how can I find as many photos as possible in a single
location?

Bouncing ideas with @technisette TODO

TODO Research whether I collected all locations in Colombia
* Can I find some in Google that aren't in my list? Why?


* Lessons learned



Country Heatmap
===============

* PowerBI supports only 30,000 records for graphing, so had to cluster
  and pick most prominant "location" for each cluster



URL Analysis
============

* ~20% of locations are tied to a website

* Social Media
  * instagram.com top result by a factor of 3, compared to any other website
  * ~1% of all locations tied to an instagram account
  * also in the top count is twitter.com 
  * in total, 1.5% of locations in Colombia link to Instagram, Facebook,
    Twitter, or Youtube
  * What can we do with this? If your target has posted/tagged one of the lucky
    few thousand profiles linked to by a location,
    _it is possible to geolocate the target from their post_.
  * `top-domains.png`
  * 0.1% of domains are using popular URL shorteners
  * 70% of those shorteners are bit.ly
  * 23% of shorteners are goo.gl.
  * 15% of domains are using HTTPS
  * 85% of domains are using HTTP




* some statistics from the scrape
  * Distinct countries: Just 1, Colombia - I didn't have time for anything else!
  * Distinct "cities" (as labeled by IG): TODO
  * Most populous cities/neighborhoods
    * Does it line up with actual population centers?
  * Locations found: 202754
  * Total elapsed time: 9 days, 2 hours, 43 minutes, and 58 seconds
  * Total HTML/JSON downloaded: 1.8 GB
  * Locations in IG's directory that lead to 404/missing: 7983
  * Summarize URLs (domains, tld, working/non)
  * Any duplicate location names?
  * Can I put some of this into a shareable infographics?
  * 99.94% of locations have a latitude and longitude filled in


Phone Number Analysis
=====================

* 35% of locations have a phone number in their profile
* Top 10 most popular phone formats account for 86% of all listed phone numbers
  * Examples (randomly generated)
  * `9339177685` (48%)
  * `1364365` (10%)
  * `+112567827738` (9%)
  * `+0469182764` (8.5%)
  * `683000810503` (2%)
  * `911 1094190` (1.8%)
  * `(6) 1907888` (1.7%)
  * `+95 537 5430594` (1.6%)
  * `47787641` (1%)
  * `169 552 4752` (0.9%)
* Top 1 format covers just about 50% of the data
* You can use this data to craft more realistic sockpuppets - if you have to
  join a Whatsapp group using a local number, for example, knowing not to use
  the standard U.S. format (area code, etc.) will help you blend in.
* In total, duplicate phone numbers appear ~7000 times in the dataset
* Very long tail of numbers appearing 2 or 3 times, but some numbers
  appear 50 or 60 times
  * Those numbers correspond to restaurant pages with multiple locations:
    * Hamburguesas El Corral (60)
    * Juan Valdez Café (50)
    * Jeno's Pizza (23)

Example duplicate phone number:
005742308543 - Aula-i Internacional,  Espacio Cultural Idependiente
Lists three pages:
  * https://www.instagram.com/explore/locations/254735730/aula-i
  * https://www.instagram.com/explore/locations/187653304757411/aula-i-internacional-espacio-cultural-idependiente
  * https://www.instagram.com/explore/locations/700324086/aula-resto-barcafe/
    * This location is the most popular, and following the "Top Posts" trick
      on the other two pages, you can also find this page.

* What can we learn from duplicate numbers?
  * If geo distance is far, duplicate probably are separate locations of one business
  * If geo distance is close, possibly duplicate pages for the same real location/business


Future Work
===========

* Scan all the other countries
* Harvest data on a few new fields that I missed the first time
  * Log the locations that are "missing" - are there patterns?
  * Canonical location ID. There were about 150 "duplicate" records
    I counted in Colombia, but as @technisette figured out, IG could have
    been feeding me some alternate IDs that I didn't capture.
  * Post count. I don't have any plans to archive the actual image content
    from Instagram, but there are a lot of profiles that have few to no posts.
    Capturing the data would help determine the most popular locations in a
    region by volume (and maybe could be used to map out a photo-tour of a
    city? most photogenic! :) )
  * Has public posts: I've noticed locations have a "post count" > 0 but
    visiting the page displays nothing. This could be caused by private profiles
    tagging a location (too bad there's no way to find which profiles they are!),
    or maybe some other reason. Either way, when doing OSINT analysis, having the
    ability to filter out locations where you won't find a single photo to 
    analyze will speed up your work.
