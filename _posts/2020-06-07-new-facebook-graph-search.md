---
layout: post
title: The New Facebook Graph Search
description: Some description
category: infosec
tags:
  - facebook
  - osint
---


**Note**: this post originally appeared on [this Github Gist](https://gist.github.com/nemec/2ba8afa589032f20e2d6509512381114)
on Jun 11, 2019. I've reposted it here for posterity.


How to Use
==========

Take the following URL

    https://www.facebook.com/search/top/?q=people&epa=FILTERS&filters=

Replace `/search/top/` with the appropriate general search type (see
headings below). One filter from each second-level header can be combined
with each other, but I don't believe you can combine multiple filters from
the same second-level header.

Replace the word `people` with your keyword search term (this is sadly a
*required* field). It does not seem to be "semantic", and it only serves to
add another filter to the below semantic filters.

Find any additional semantic filter(s) below (the JSON) that you want to filter
on. Use [this page](https://jsonformatter.curiousconcept.com/) for testing
your JSON, but before submitting make sure you remove all whitespace from your
JSON - you can set the "JSON Template" drop down to **Compact** in the
formatter if you like, it will remove all whitespace for you. Note also that
often there is JSON embedded *within* JSON. This is where you'll see a backslash
before a quote (`\"`). Make sure to leave those backslashes alone.

When you combine filters, put them together in the same JSON object. For example,
if I take Posts From a Page

    {"rp_author":"{\"name\":\"author\",\"args\":\"119375054750638\"}"}

and combine with Posts I've Interacted

    {"interacted_posts":"{\"name\":\"interacted_posts\",\"args\":\"\"}"}

the combined filter should look like this:

    {
        "rp_author":"{\"name\":\"author\",\"args\":\"119375054750638\"}",
        "interacted_posts":"{\"name\":\"interacted_posts\",\"args\":\"\"}"
    }

and compact down to:

    {"rp_author":"{\"name\":\"author\",\"args\":\"119375054750638\"}","interacted_posts":"{\"name\":\"interacted_posts\",\"args\":\"\"}"}

Next, find a [Base64 encoder](https://www.base64encode.org/) and paste the
compacted JSON into it. Encode the JSON above and you see the following:

    eyJycF9hdXRob3IiOiJ7XCJuYW1lXCI6XCJhdXRob3JcIixcImFyZ3NcIjpcIjExOTM3NTA1NDc1MDYzOFwifSIsImludGVyYWN0ZWRfcG9zdHMiOiJ7XCJuYW1lXCI6XCJpbnRlcmFjdGVkX3Bvc3RzXCIsXCJhcmdzXCI6XCJcIn0ifQ==

Remove any equals signs at the end (Facebook doesn't need them) and then put
the Base64'd JSON at the end of the URL you built above, after `filters=`

    https://www.facebook.com/search/top/?q=people&epa=FILTERS&filters=eyJycF9hdXRob3IiOiJ7XCJuYW1lXCI6XCJhdXRob3JcIixcImFyZ3NcIjpcIjExOTM3NTA1NDc1MDYzOFwifSIsImludGVyYWN0ZWRfcG9zdHMiOiJ7XCJuYW1lXCI6XCJpbnRlcmFjdGVkX3Bvc3RzXCIsXCJhcmdzXCI6XCJcIn0ifQ


Initial inspiration
===================

https://twitter.com/henkvaness/status/1136937742712094721


/search/top/
============

Sort By
-------

### Most Recent

    {"rp_chrono_sort":"{\"name\":\"chronosort\",\"args\":\"\"}"}


Posts From
----------

### Posts from you

    {"rp_author":"{\"name\":\"author_me\",\"args\":\"\"}"}

### Posts from Your Friends

    {"rp_author":"{\"name\":\"author_friends_feed\",\"args\":\"\"}"}

### Posts From Your Groups and Pages

    {"rp_author":"{\"name\":\"my_groups_and_pages_posts\",\"args\":\"\"}"}

### Posts From Public

    {"rp_author":"{\"name\":\"merged_public_posts\",\"args\":\"\"}"}

### Posts from page:

    {"rp_author":"{\"name\":\"author\",\"args\":\"119375054750638\"}"}


Post Type
---------

### Posts You've Seen

    {"interacted_posts":"{\"name\":\"interacted_posts\",\"args\":\"\"}"}


Posted In Group
---------------

### Your Groups

    {"rp_group":"{\"name\":\"my_groups_posts\",\"args\":\"\"}"}

### From Group

    {"rp_group":"{\"name\":\"group_posts\",\"args\":\"574981909329531\"}"}


Tagged Location
---------------

    {"rp_location":"{\"name\":\"location\",\"args\":\"115028691842393\"}"}


Date Posted
-----------

### 2019

    {"rp_creation_time":"{\"name\":\"creation_time\",\"args\":\"{\\\"start_year\\\":\\\"2019\\\",\\\"start_month\\\":\\\"2019-1\\\",\\\"end_year\\\":\\\"2019\\\",\\\"end_month\\\":\\\"2019-12\\\",\\\"start_day\\\":\\\"2019-1-1\\\",\\\"end_day\\\":\\\"2019-12-31\\\"}\"}"}



/search/posts/
==============

Posts From
----------

### Posts from you

    {"rp_author":"{\"name\":\"author_me\",\"args\":\"\"}"}

### Posts from Your Friends

    {"rp_author":"{\"name\":\"author_friends_feed\",\"args\":\"\"}"}

### Posts From Your Groups and Pages

    {"rp_author":"{\"name\":\"my_groups_and_pages_posts\",\"args\":\"\"}"}

### Posts From Public

    {"rp_author":"{\"name\":\"merged_public_posts\",\"args\":\"\"}"}

### Posts from page:

    {"rp_author":"{\"name\":\"author\",\"args\":\"119375054750638\"}"}


Post Type
---------

### Posts You've Seen

    {"interacted_posts":"{\"name\":\"interacted_posts\",\"args\":\"\"}"}


Posted In Group
---------------

### Your Groups

    {"rp_group":"{\"name\":\"my_groups_posts\",\"args\":\"\"}"}

### From Group

    {"rp_group":"{\"name\":\"group_posts\",\"args\":\"574981909329531\"}"}


Tagged Location
---------------

    {"rp_location":"{\"name\":\"location\",\"args\":\"115028691842393\"}"}


Date Posted
-----------

### 2019

    {"rp_creation_time":"{\"name\":\"creation_time\",\"args\":\"{\\\"start_year\\\":\\\"2019\\\",\\\"start_month\\\":\\\"2019-1\\\",\\\"end_year\\\":\\\"2019\\\",\\\"end_month\\\":\\\"2019-12\\\",\\\"start_day\\\":\\\"2019-1-1\\\",\\\"end_day\\\":\\\"2019-12-31\\\"}\"}"}



/search/people/
===============

City
----

    {"city":"{\"name\":\"users_location\",\"args\":\"115028691842393\"}"}

Education
---------

    {"school":"{\"name\":\"users_school\",\"args\":\"751335894893898\"}"}

Work
----

    {"employer":"{\"name\":\"users_employer\",\"args\":\"20531316728\"}"}


Mutual Friends
--------------

### Friends

    {"friends":"{\"name\":\"users_friends\",\"args\":\"\"}"}

### Friends of Friends

    {"friends":"{\"name\":\"users_friends_of_friends\",\"args\":\"\"}"}

### Friend with People

    {"friends":"{\"name\":\"users_friends_of_people\",\"args\":\"100000154813605\"}"}



/search/photos/
======

Posted By
---------

### Posts from you

    {"rp_author":"{\"name\":\"author_me\",\"args\":\"\"}"}

### Posts from Your Friends

    {"rp_author":"{\"name\":\"author_friends_feed\",\"args\":\"\"}"}

### Posts From Your Groups and Pages

    {"rp_author":"{\"name\":\"my_groups_and_pages_posts\",\"args\":\"\"}"}

### Posts From Public

    {"rp_author":"{\"name\":\"merged_public_posts\",\"args\":\"\"}"}

### Posts from page:

    {"rp_author":"{\"name\":\"author\",\"args\":\"119375054750638\"}"}

Photo Type
----------

### Photos you've seen

    {"interacted_photos":"{\"name\":\"interacted_photos\",\"args\":\"\"}"}

Tagged Location
---------------

    {"rp_location":"{\"name\":\"location\",\"args\":\"115028691842393\"}"}

Date Posted
-----------

### 2019

    {"rp_creation_time":"{\"name\":\"creation_time\",\"args\":\"{\\\"start_year\\\":\\\"2019\\\",\\\"start_month\\\":\\\"2019-1\\\",\\\"end_year\\\":\\\"2019\\\",\\\"end_month\\\":\\\"2019-12\\\",\\\"start_day\\\":\\\"2019-1-1\\\",\\\"end_day\\\":\\\"2019-12-31\\\"}\"}"}



/search/videos/
===============

Source
------

### Live

    {"videos_source":"{\"name\":\"videos_live\",\"args\":\"\"}"}

### Episodes

    {"videos_source":"{\"name\":\"videos_episode\",\"args\":\"\"}"}

### Friends and Groups

    {"videos_source":"{\"name\":\"videos_feed\",\"args\":\"\"}"}

Tagged Location
---------------

    {"rp_location":"{\"name\":\"location\",\"args\":\"115028691842393\"}"}

Date Posted
-----------

### 2019

    {"rp_creation_time":"{\"name\":\"creation_time\",\"args\":\"{\\\"start_year\\\":\\\"2019\\\",\\\"start_month\\\":\\\"2019-1\\\",\\\"end_year\\\":\\\"2019\\\",\\\"end_month\\\":\\\"2019-12\\\",\\\"start_day\\\":\\\"2019-1-1\\\",\\\"end_day\\\":\\\"2019-12-31\\\"}\"}"}


/search/pages/
==============

Verified
--------

### Verified

    {"verified":"{\"name\":\"pages_verified\",\"args\":\"\"}"}


Category
--------

### Local Business or Place

    {"category":"{\"name\":\"pages_category\",\"args\":\"1006\"}"}

### Company, Organization, Or Institution

    {"category":"{\"name\":\"pages_category\",\"args\":\"1013\"}"}

### Brand or Product

    {"category":"{\"name\":\"pages_category\",\"args\":\"1009\"}"}

###Artist, Band, or Public Figure

    {"category":"{\"name\":\"pages_category\",\"args\":\"1007,180164648685982\"}"}

### Entertainment

    {"category":"{\"name\":\"pages_category\",\"args\":\"1019\"}"}

### Cause or Community

    {"category":"{\"name\":\"pages_category\",\"args\":\"2612\"}"}



/search/places/
===============

This one is different... I haven't figured out how it works yet. The `ref=`
parameter decodes into something with a session ID or something:

    {"sid":"97e8f46cce641da376d91e4b2b1c2381","ref":"places_top_module_see_more"}
 
