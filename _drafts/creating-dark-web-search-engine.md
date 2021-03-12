---
layout: post
title: Creating a Dark Web Search Engine
description: Build a Dark Web search engine with TorBot and Elasticsearch
category: infosec
tags:
  - dotnet
  - csharp
  - entityframework
headerImage: 2020/05/port-scan-header.png
headerImageAttrib: image credit - bitninja.io
---

# Intro

TODO

# Pre-Requirements

You should have the following already installed and it's recommended to
have the programs running from your PATH (e.g. you can run `python3` from
a console and get a Python prompt):

* Python 3 (mine is 3.8.6)
* Git


# Install and Setup

Now we're going to install Elasticsearch and set up a Python environment
with the required packages.

## Tor

    sudo apt install tor


## Python

Create a new folder for your code:

    mkdir tor_search engine

Create a virtual environment:

    python3 -m venv env

If this fails with an error, you may need to install venv first:

    sudo apt install python3-venv

Activate the environment:

    source env/bin/activate

Install libraries (I'm using the latest version of ES available, 7.11.0):

    pip install 'elasticsearch>=7.0.0,<8.0.0'

## Elasticsearch

Elasticsearch can be downloaded and installed for all supported platforms
from [its website](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html). I'll be starting with the
[Debian](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)
instructions which will work on Ubuntu as well.

1. Import Elasticsearch's key:

    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

2. Install the repository:

    echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" \
       | sudo tee /etc/apt/sources.list.d/elastic-7.x.list

3. Install Elasticsearch:

    sudo apt update && sudo apt install elasticsearch

4. If you want to store Elasticsearch data in a specific directory (such as
   an SSD), we need to edit the configuration file. This step is optional.
   Run the following command to edit (it requres root access):

    sudo nano /etc/elasticsearch/elasticsearch.yml

   Edit the line that begins `path.data` (line 33 on my install) to point to
   your folder:

    path.data: /var/lib/elasticsearch

5. Next, add the following to the bottom of the configuration file to enable
   authentication. Your system is probably safe if you're running 
   Elasticsearch from your PC, but it's a very good habit to get into
   securing access to your services so that you don't accidentally
   [become a new story](https://www.techradar.com/news/what-is-elasticsearch-and-why-is-it-involved-in-so-many-data-leaks) 
   someday :)

    sudo nano /etc/elasticsearch/elasticsearch.yml

   Content:

    xpack:
      security:
        enabled: true
        authc:
          realms:
            native:
              native1:
                order: 0

6. Next, make sure the elasticsearch user can read and write that folder
   with this terminal command:

    sudo chgrp elasticsearch /var/lib/elasticsearch

7. Start Elasticsearch:

    sudo systemctl start elasticsearch.service

8. Configure the default password for the `elastic` user with the following
   command. If you are on a non-Linux system, the 
   `elasticsearch-setup-passwords` program should be in your Elasticsearch
   installation directory:

    sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto

   It will print passwords to the console for nine default users. Keep note
   of the password for the `elastic` user for later.

   You can also choose the passwords for each of the nine accounts yourself
   with the following:

    sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive

9. Now verify that Elasticsearch is running properly by visiting the
   following URL in your browser (on the same machine as ES). You will be
   prompted for your username and password, and after tt should display 
   some JSON data including a name and a cluster_name.

    http://localhost:9200/

```json
{
  "name" : "mypc",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "QiO8Okjdj-GydVGu-FSww",
  "version" : {
    "number" : "7.11.0",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "8ced7813d6f16d2ef30792e2fcde3e755795ee04",
    "build_date" : "2021-02-08T22:44:01.320463Z",
    "build_snapshot" : false,
    "lucene_version" : "8.7.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

10. Create your index with the included Python script:

    python es_setup.py --password <your_password>

   This should print the words 'Index "website-contents" created'. Now
   verify by visiting this URL in your browser:

    http://localhost:9200/_cat/indices

   This should print something similar to the following. Make sure it
   contains the words `website-contents`:

    green  open .security-7      -r0hPPvQQX 1 0 7 0 25.6kb 25.6kb
    yellow open website-contents dvmkujniTw 1 1 0 0   208b   208b

## Data

I'm going to use a few URLs from the [Hunchly Darkweb Report] to seed the
crawler. Note that Hidden Services (the term for Tor-enabled websites) go
down often, so by the time you read this post none of the listed URLs may
be active. Find some URLs or download the latest Darkweb Report to start
your search engine journey :)

Sample URLs:

```
eucannapggbtppdd.onion
vfqnd6mieccqyiit.onion
dollarvigihfb4n5.onion
53nr2wn3ig7fr5ij.onion
bg-bg.facebookcorewwwi.onion
www.p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd.onion
b4jmontpel437ch6.onion
weaponstrxqniqrt.onion
```