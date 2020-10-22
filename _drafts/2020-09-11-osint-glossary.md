---
layout: post
title: OSINT Glossary
description: Some description
category: infosec
tags:
  - osint
headerImage: 2020/05/port-scan-header.png
headerImageAttrib: image credit - bitninja.io
hidden: true
---

# Intro


Hello, welcome to my attempt to build an "OSINT Glossary" - a document defining
terms you may commonly hear spoken about in the OSINT community, especially 
some of the more technical concepts. When you venture into "open sources" of
data on the internet, eventually you'll find yourself digging into intermediate
to advanced technical concepts to find additional sources of data that may not
be easily found on the "surface" of a search engine. At the same time, many
people involved in the OSINT field come from diverse walks of life and it can
easily be overwhelming to come up to a wall of acronyms and jargon that you
don't understand.

There is already a lot of good "intro to OSINT" content out in the world, but
it seems most of the content explaining what, exactly a concept or term means
is spread across hundreds of blog posts and videos. I'd like to build this
resource to gather all the terms in one place, spend a short amount of time
describing what the term means and why it's relevant to OSINT, and sometimes
leave you with further reading on the topic. I will, as best I can, avoid
talk of specific "tools" because, as awesome as they are, inevitably tools
will fall into disrepair due to lost interest, lack of profitability, or
the data source they rely upon is closed or otherwise made unavailable.

# How to use this glossary

This isn't a traditional A-Z glossary, although I will try to create a listing
summary if my blog software will let me. I'm going to try grouping related terms
and concepts together into categories, so if you want to know more about a
topic, feel free to read this article "book-style". Otherwise, if you're
looking for a specific term just hit `Ctrl+F` and search for it on the page.
If you don't see what you're looking for but feel it belongs in this guide,
feel free to reach out to me and I'll see if I can get it added. Enjoy!


# Topics

## What is OSINT?

OSINT is an acronym, short for Open Source Intelligence. Today, the term is
used to mean the collection and analysis information that's available to the
general public.[^osint-def] There are some who dispute whether [deep
web](#deep-web) content on websites that have registration open to all is
considered truly "open source", but there are many researchers who set up
[sockpuppets](#sockpuppets) to gain access to that data and consider it part of
open source intelligence gathering and analysis.

OSINT is *not* limited solely to electronic data or even to data that can be
found on the internet - there are many sources of OSINT that can found in
public records including published print materials (newspapers, magazines),
paid databases, government records (such as those found in courthouses or
libraries), and professional/academic publications.[^osint-categories] However,
many or all of these may also be archived onto internet websites that can be
found through common or specialized search engines.

The term dates back to the 1941 creation of the U.S. Foreign Broadcast
Information Service, an agency developed to support World War II operations by
analyzing unclassified sources of data.[^army-osint-ety] Today the concept is
leveraged in many different job fields, including sourcing (recruiting),
financial and corporate investigations, journalism and media, and cyber threat
intelligence.[^technisette-osint-job]

It's also important to understand that effective OSINT must include an
*analysis* of collected data. Simply collecting data without a plan to analyze
it, especially in the current era where there are magnitudes more data created
on a daily basis than existed - in total - a few hundred years ago, will
quickly lead to [information overload](#information-overload).

You may also hear people, particularly journalists and independent researchers
with no government experience, use the term "[Digital Investigation](#digital-investigation)".
It is more or less a synonym for OSINT, but also tries to separate itself
from the military, law enforcement, and spy agency contexts that shadow over
the term "OSINT".

[^osint-def]: <https://www.recordedfuture.com/open-source-intelligence-definition/>
[^technisette-osint-job]: <https://osintcurio.us/2020/04/01/how-to-land-an-osint-job/>
[^army-osint-ety]: <https://www.army.mil/article/94007/Service_members__civilians_learn_to_harness_power_of__Open_Source__information>
[^osint-categories] <https://en.wikipedia.org/wiki/Open-source_intelligence#Principles>

## Intelligence Topics

### Intelligence

The word 'intelligence' used in an OSINT context refers to an approach to
collection and analysis of information to assist decision makers in making
the correct decision. There are many kinds of intelligence. Military
intelligence[^military-intel] is used to assist military command in strategic,
operational, and tactical operations both on and off the battlefield. Political
intelligence[^political-intel] is information about government workings that can
be leveraged for profit or corporate benefit. Corporate, or competitive, intelligence[^corporate-intel]
is information about competitors and product markets that businesses can use to
develop profitable product offerings, avoid costly mistakes, and gain market share.

[^military-intel]: <https://en.wikipedia.org/wiki/Military_intelligence>
[^political-intel]: <https://www.motherjones.com/politics/2013/11/political-intelligence-industry-jellyfish/>
[^corporate-intel]: <https://advisory.kpmg.us/services/risk-strategy-compliance/forensic-services/corporate-intelligence.html>


### The Intelligence Cycle

Within intelligence communities, a commonly used process of gathering and using intelligence
effectively is known as the "Intelligence Cycle". The cycle reflects the ability to
take analyzed intelligence, use it to gain further, more detailed
intelligence, and repeat the process indefinitely until the end goal is reached.

The exact breakdown of the individual steps of the intelligence cycle may vary,
but a common classification includes five categories: planning, collection,
processing, analysis, and dissemination.[^intel-cycle-steps]

[^intel-cycle-steps]: https://www.intelligencecareers.gov/icintelligence.html

#### Planning

#### Collection

#### Processing

#### Analysis

#### Dissemination


[^intel-cycle-secjuice]: <https://www.secjuice.com/the-osint-intelligence-cycle-part-i-planning-and-direction/>
[^intel-cycle-secjuice2]: <https://www.secjuice.com/osint-and-the-intelligence-cycle-part-ii-collection/>
[^intel-cycle-secjuice3]: <https://www.secjuice.com/osint-the-intelligence-cycle-part-iii-processing-raw-intelligence/>

### GEOINT

GEOINT is an abbreviation for Geospatial Intelligence. The word geospatial
refers to the geography and geometry of the Earth, and the intelligence that is
captured as part of GEOINT includes GPS, mapping data, imagery (photography,
videography, satellite imagery, etc.), and topography.[^geoint-def] GEOINT ties
in with OSINT through a number of avenues. Public social media and content
sharing sites often include imagery and videos. This data can be used to
identify subjects, track locations, and verify statements for factual truth.

[^geoint-def]: https://www.cia.gov/news-information/featured-story-archive/2010-featured-story-archive/geospatial-intelligence.html

### IMINT

IMINT stands for Imagery Intelligence. It is a subset of [GEOINT](#geoint)
focusing specifically on intelligence derived from imagery, such as satellite,
drone, other aeriel photography.[^imint-def] IMINT ties in with OSINT via...

TODO: expand

[^imint-def]: https://en.wikipedia.org/wiki/Imagery_intelligence

### SOCMINT

SOCMINT is an acronym for Social Media Intelligence. SOCMINT is a component of
OSINT focusing on websites that allow users to form networks and communities for
discussion. Components of social media include the ability for users to create
"profiles" of themselves that sometimes includes detailed personal information
as well as the ability to communicate with other users. These communication patterns
can reveal hidden relationships between people that can develop into additional 
leads.

### HUMINT

### SIGINT

* Identity
  * Names (regional differences)
  * Username
    * Years, age
    * Hobbies
    * Real name
  * Email Address
  * Phone Number
  * Home Address
  * IP Address
    * LE - warrants, service provider, third-party website logs
    * General location
    * VPN(!)
  * Accounts
    * Social Media
      * Regional/Country social media
    * Online Communities/Forums/Discords
    * Dating Profiles
    * Personal Website
    * Document repositories (gdrive, youtube, flickr)
* Company Records
  * Annual Reports
  * News websites
  * Breach Data
  * Political Contributions
  * Corporate Website
    * Leadership
  * Job Boards/Career Sites (Monster, Linkedin)
    * Where company has a physical presence
    * Where certain roles (sales, datacenter, dev) are headquartered
    * Technology Stack
* Search Engine
  * Besides the obvious
  * Country-specific
  * Different engines specialize in different things
  * Exact keyword search
  * Privacy
  * Specialized search engines (patent, people, phone)
* Google dork
  * https://osintcurio.us/2019/12/20/google-dorks/
* GIS
* Geolocation
* Geospatial
* Graph Search
* Leaks
* Dumps
* Breach/Data Breach
  * https://osintcurio.us/2019/05/21/basics-of-breach-data/
* Hashing
* Buckets
  * Cloud
  * FTP
  * Open Directory
* Pastes
  * Paste sites
* Internet of Things
* Vulnerability
* Responsible Disclosure
* VM
* Emulator/Emulation
  * Phone emulation
* Terminal/Command Line
* Dev Tools
* HTTP requests
* Web Scraping
* Cookies
* CSRF
* Password Manager
* Scraping
  * Redir to Web Scraping
* Backlink
* VPN
* Corporate Intelligence
  * https://www.pwc.com/ua/en/services/forensic/corporate-intelligence.html
* Competitive Intelligence
  * https://en.wikipedia.org/wiki/Competitive_intelligence
* Recon
* Passive Collection
* Active Collection  
* DFIR
* Threat Intelligence
* Imageboard
  * 4chan, etc.
* Metadata
  * EXIF
  * Filesystem metadata
  * Embedded document metadata
* Reverse Image Search
* Revenge Porn / Non-consensual pornography (NCP) / Non-consensual Image Abuse (NCIA)
* Phishing
* Cryptography
  * Asymmetric Cryptography
  * Symmetric Cryptography
* Cryptocurrency
* Bitcoin
* Dox/Doxing/Doxxing


## Dark Web / Darknet

In reality it's still HTML + CSS + JS. You could think of tor as an "alternate internet" because .onion sites bypass much of the standard internet infrastructure.
* Domain registration isn't controlled by ICANN or independent registrars. Instead, domains are created for free via mathematical proof
* There are no IP addresses involved (in the tor layer)
* It uses a novel kind of "DNS" (method for finding the .onion server you want to talk to) and "BGP" (moving messages between point A (your PC) and point B (the .onion server) in a secure way) that aren't compatible with their "clearnet" counterparts.
IMO tor is only "special" because:
* There's a barrier to entry for the average person (all OSes now come with a web browser by default, but not tor enabled)
* Bypassing standard internet infrastructure offers less regulation and less ability for organizations like ICANN to take punitive measures for sites that break the law.
But in the end, .onion sites are serving up web pages in a very similar way to normal websites, so they can look the exact same.

Secondly, yes you can visit normal, non .onion websites over the tor network. Nothing special, right? However, that's only possible because of the existence of exit nodes. Exit nodes are really just another phrase for "proxy" - you make a request to the tor network, the exit node translates that into a regular webpage request (from their IP address instead of yours), then translates the webpage response back into the tor network so that your tor-enabled browser can read it.
By analogy, think of it like phoning somebody up and telling them, "I want amazon.com". They download amazon.com into HTML files, put them on a flash drive, and mail you the flash drive. Plug that into your PC and you can open the HTML in your browser - bang! you've got a webpage. Obviously the tor network does this a lot faster than shipping physical mail and with a lot more detail, but it has many of the same qualities:
* Amazon does not know that you were the one who requested the web page (assuming you're not logged in)
* Your ISP doesn't know that you visited Amazon

However, the security of tor goes even further than that. After all, your friend
now knows about your acute interest in Barney memorabilia and he's in a great
position to tell all of your other friends about your deepest secret. The next
bit of security is known as "Onion Routing", which is an analogy to the many
layers of an onion and it's used to hide a message in a way that the receiver
doesn't know who the sender is. The way this works is that the tor network
publishes a directory of nodes on the network - couriers, if you will.

#TODO image of a chain of couriers

Your
tor-enabled browser chooses a route from the directory that passes between
multiple couriers and, using [asymmetric cryptography](#asymmetric-cryptography),
_encrypts_ the message using the encryption keys from each courier. It starts
backwards on the route, first encrypting your message with the keys of the final
destination. Then that encrypted message is encrypted again with the keys of
the last courier in the chain, and _that_ output is encrypted again by the keys
of the next courier. This continues repeatedly until the single message has been
encrypted by the keys of every courier.

#TODO image of encrypted layers

Your message is now buried within multiple layers of encryption and only _one_
courier has the ability to unlock each layer. You pass this message off to the
first courier, who has the keys to unlock the first layer. Once that's done,
only one other courier can unlock the next layer so they pass the message off
to them. This, too, happens repeatedly until your message reaches the final
destination and they unlock and read your message. Due to all of the layers,
each courier only knows two identities - the person they _received_ the message
from and the person they _gave_ the message to. With a long enough chain of
couriers, there is no way for the person reading your unencrypted message to
know it was you who sent it - a truly anonymous message.

Keep in mind, this only works properly if you don't identify yourself _within_
the message you've sent to the other party. Tor may be able to hide that you're
accessing a website, but if you log in to that website, you're sending them
directly your username and password - so in that case it's quite easy for
the website to connect the dots and realize who you are.


## Deep Web

* Tor
* Darknet Market
* Carding
* Denial of Service (DoS)
* Distributed Denial of Service (DDoS)
* OPSEC
  * OPSEC for OSINT

### Sockpuppets

* as
    * Don't upload confidential/illegal data to online search sites
    * VPN
    * https://osintcurio.us/2019/04/18/basic-opsec-tips-and-tricks-for-osint-researchers/
  * Account lockdown
  * Right to be Forgotton?
* Sock Puppet
* Burner (Phone)
* MFA/2FA/Two Factor Authentication/OTP
* Deepfake
* Maltego/Gephy
* Link analysis
* JSON
* Base64
* Mobile?
  * Mobile-only apps
  * Populations with only cell phone (e.g. communicate by whatsapp)
* WHOIS
  * DNS
  * Hostnames/subdomain
  * CDN (Cloudflare)
  * Hosting
  * Bulletproof Hosting
* Certificates
  * Cert log
  * Subject Alternative Names
  * CN (company owner)
  * https://osintcurio.us/2019/03/12/certificates-the-osint-gift-that-keeps-on-giving/
* Cache (Website)
  * https://osintcurio.us/2019/02/12/osint-on-deleted-content/
* Archive
* Mirror
* Public Records
  * Property Records
  * Court/Criminal/Civil
  * Government Records
  * Financial / Tax Records
  * Birth Records
  * Death Records
  * Local Government Data
    * State/County (US)
  * Voter Records
  * Patent Records
  * Political Records
  * FOIA (US)
* Disinformation
* Misinformation
* Verification
  * Free verification handbook: https://datajournalism.com/read/handbook/verification-3
  * Image/Video verification
  * Image/Video geolocation
* Open Network
  * https://www.cjr.org/tow_center_reports/guide-to-osint-and-hostile-communities.php
* Closed Network
  * https://www.cjr.org/tow_center_reports/guide-to-osint-and-hostile-communities.php
  * Note difference between it and Deep Web
* Encryption
* End to End Encryption

## Other Topics

### Digital Investigation

This is simply another phrase describing [OSINT](#what-is-osint) practices
and techniques. Some journalists and researchers prefer to use this phrase
to separate their work from the context of OSINT as used in the military,
law enforcement, and spy agencies.

### Information Overload

According to Dr. Peter Roetzel, information overload is a state in which a
decision maker faces a set of information of certain size and complexity that
the decision maker's ability to optimally determine the best possible decision
is negatively impacted.[^roetzel] You can collect and run all of the OSINT
tools in the world, but if you are unable to leverage the data to accomplish
your end goal, you're simply "hoarding" data and not properly practicing OSINT.

Some reasons that you may face Information Overload:

* It's data that you don't understand: if the collected data is in a format
  you don't have the knowledge or tools to understand, then you will be unable
  to draw conclusions from the data and you've wasted your time collecting it.
  If the data collected is too complex for your team to wrap their heads around
  (out of their field of expertise), then you risk drawing the wrong conclusions
  from the data or overlooking critical, but small details in the results.
* It's too much data to process: if the sheer quantity of collected data is too
  much for your team's available workload, then you risk drawn out project timelines
  or drawing conclusions from an incomplete picture of the data. If you find a tool
  that is able to collect data on thousands of potential suspects, but you only have
  a couple of people available to manually dig through the results, then you may
  find your progress stalled while your team slowly processes the data one-by-one.
  Sometimes you will find tools available to help process mass quantities of data,
  but ensure that your Subject Matter Experts are able to provide input to the 
  tool so that it's able to accurately filter out relevant data from irrelevant
  data or properly aggregate it.

[^roetzel]: <https://link.springer.com/article/10.1007/s40685-018-0069-z>