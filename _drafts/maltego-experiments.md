---
layout: post
title: Experiments with custom Maltego transforms
description: My experience creating custom Maltego transforms with the Canari framework
category: infosec
tags:
  - maltego
  - infosec
  - osint
headerImage: 2020/04/network.jpg
headerImageAttrib: Gerd Altmann @ pixabay.com
---


* TOC
{:toc}


## Introduction




## Whoxy




Whoxy
* Add seed
* Configure API key
* Transform details

## Whoxy Documentation

Seed URL on Public TDS: `https://cetas[.]paterva[.]com/TDS/runner/showseed/58NlT6SrcMwj`

### Whoxy Live Whois

| Meta Info         | Data |
|-------------------|------|
| Display Name      | Whoxy Live Whois |
| Transform Name    | WhoxyLiveWhois |
| Short Description | This transform returns details on the current registrant and contacts for a domain. |
| Data Source       | Whoxy (https://www.whoxy.com/) |
| Author            | Dan Nemec |
| Input             | Domain |
| Output            | Company, EmailAddress, PhoneNumber, Person, Location, NSRecord |

#### Transform Input Settings

| Property ID | Name          | Default | Description |
|-------------|---------------|---------|-------------|
| whoxyapikey | Whoxy API Key | N/A     | API Key from your Whoxy account |

#### Description

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.


### To Historical Whois Info

| Meta Info         | Data |
|-------------------|------|
| Display Name      | To Historical Whois Info [whoxy] |
| Transform Name    | WhoxyWhoisHistory |
| Short Description | This transform returns registration history for a domain as it's changed over time. |
| Data Source       | [Whoxy](https://www.whoxy.com/) |
| Author            | Dan Nemec |
| Input             | Domain |
| Output            | Company, EmailAddress, PhoneNumber, Person, Location, NSRecord |

#### Transform Input Settings

| Property ID | Name          | Default | Description |
|-------------|---------------|---------|-------------|
| whoxyapikey | Whoxy API Key | N/A     | API Key from your Whoxy account |
#### Description

This transform returns registration history for a domain.
No live WHOIS records are requested, only what's present in Whoxy's database.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.

### To Domains This Person Owns

| Meta Info         | Data |
|-------------------|------|
| Display Name      | To Domains This Person Owns [whoxy] |
| Transform Name    | WhoxyReversePerson |
| Short Description | This transform returns details on the all of the domains registered by a person. |
| Data Source       | [Whoxy](https://www.whoxy.com/) |
| Author            | Dan Nemec |
| Input             | Person |
| Output            | Domain |

#### Transform Input Settings

| Property ID         | Name          | Default | Description |
|---------------------|---------------|---------|-------------|
| whoxyapikey         | Whoxy API Key | N/A     | API Key from your Whoxy account |
| whoxymaxsearchpages | Maximum Pages about 100 entities per page | 1 | Maximum number of pages (API calls) requested from Whoxy API. Returns around 100 results per page. Set to -1 for no limit |

#### Description

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

This transform is case-sensitive according to the Whoxy documentation, but I'm not sure this is actually true in practice.

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.

### To Domains This Company Owns

| Meta Info         | Data |
|-------------------|------|
| Display Name      | To Domains This Company Owns [whoxy] |
| Transform Name    | WhoxyReverseCompany |
| Short Description | This transform returns details on the all of the domains registered by a Company. |
| Data Source       | [Whoxy](https://www.whoxy.com/) |
| Author            | Dan Nemec |
| Input             | Company |
| Output            | Domain |

#### Transform Input Settings

| Property ID         | Name          | Default | Description |
|---------------------|---------------|---------|-------------|
| whoxyapikey         | Whoxy API Key | N/A     | API Key from your Whoxy account |
| whoxymaxsearchpages | Maximum Pages about 100 entities per page | 1 | Maximum number of pages (API calls) requested from Whoxy API. Returns around 100 results per page. Set to -1 for no limit |

#### Description

This transform is case-sensitive according to the Whoxy documentation, but I'm not sure this is actually true in practice.

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.

### To Domains This Address Owns

| Meta Info         | Data |
|-------------------|------|
| Display Name      | To Domains This Address Owns [whoxy] |
| Transform Name    | WhoxyReverseEmail |
| Short Description | This transform returns details on the all of the domains registered with an email address. |
| Data Source       | [Whoxy](https://www.whoxy.com/) |
| Author            | Dan Nemec |
| Input             | EmailAddress |
| Output            | Domain |

#### Transform Input Settings

| Property ID         | Name          | Default | Description |
|---------------------|---------------|---------|-------------|
| whoxyapikey         | Whoxy API Key | N/A     | API Key from your Whoxy account |
| whoxymaxsearchpages | Maximum Pages about 100 entities per page | 1 | Maximum number of pages (API calls) requested from Whoxy API. Returns around 100 results per page. Set to -1 for no limit |

#### Description

This transform is case-sensitive according to the Whoxy documentation, but I'm not sure this is actually true in practice.

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.



Wayback
* Add seed
* Transform details

## WaybackMachine Documentation

Seed URL on Public TDS: `https://cetas[.]paterva[.]com/TDS/runner/showseed/cnFUrkoWmAzc`

### To Archived Snapshots of URL

| Meta Info         | Data |
|-------------------|------|
| Display Name      | To Archived Snapshots of URL [Wayback Machine] |
| Transform Name    | waybackexact |
| Short Description | This transform returns URLs linking to historical copies of the input URL archive pages on the Wayback Machine. |
| Data Source       | [Wayback Machine](https://web.archive.org/) |
| Author            | Dan Nemec |
| Input             | URL |
| Output            | URL |

#### Description

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.



Redirects
* Add seed
* Transform details

## Redirects Documentation

Seed URL on Public TDS: `https://cetas[.]paterva[.]com/TDS/runner/showseed/zpwoSWQKz3rl`

## Follow Redirects (One Level) [URL]

| Meta Info         | Data |
|-------------------|------|
| Display Name      | Follow Redirect (One Level) |
| Transform Name    | redirecttransformfromurl |
| Short Description | Contacts the URL and, if it attempts to redirect to a new URL, creates a new node for that destination. |
| Data Source       | N/A |
| Author            | Dan Nemec |
| Input             | URL |
| Output            | URL |

#### Description

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.

## Follow Redirects (One Level) [Website]

| Meta Info         | Data |
|-------------------|------|
| Display Name      | Follow Redirect (One Level) |
| Transform Name    | redirecttransformfromwebsite |
| Short Description | Contacts all URLs in the URLS property of the Website and, if any attempt to redirect to a new URL, creates a new node for each destination. |
| Data Source       | N/A |
| Author            | Dan Nemec |
| Input             | Website |
| Output            | URL |

#### Description

TODO
This transform runs on a Maltego.Twit entity which is used to represent a Tweet in Maltego. This transfrom returns the Twitter Affiliation/Account that sent a tweet.

#### Typical Use Case

TODO
Phrase --> Tweets ==> Twitter Affiliations

==> To Twitter Affiliation [Convert]
--> Related Transform

#### Example

TODO
Starting with the phrase "maltego" we can find tweets containg that phrase. From the tweets we can retrieve the Twitters accounts who sent the tweet. We can easily see that some accounts sent multiple tweets about Maltego.

## To Domain

| Meta Info         | Data |
|-------------------|------|
| Display Name      | To Domain |
| Transform Name    | urltodomain |
| Short Description | Parses the domain/hostname out of a URL (or group of URLs) |
| Data Source       | N/A |
| Author            | Dan Nemec |
| Input             | URL |
| Output            | Domain |

#### Description

This transform runs on a Maltego.URL entity and parses out just the
domain/hostname portion of the URL, returning a Maltego.Domain entity.
When run on a group of URLs, this will link together any URLs on the same
domain as each other. Additionally, the Domain entity opens up a new set
of transforms to identify information about the website where the original
URL points (such as WHOIS registrant/ownership).

#### Typical Use Case

URL ==> Domain --> To Email Address [From whois info] --> EmailAddress

==> To Domain
--> Related Transform

#### Example

Starting with a URL, "https://twitter.com/beyonce", we extract the domain
"twitter.com". From that domain, we can apply a number of new transforms,
such as requesting the email address that owns the domain ("domains@twitter.com").
This information can provide an investigator with additional leads to follow.
