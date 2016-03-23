---
layout: post
title: Dynamic DNS with CPanel
description: Updating a CPanel DNS entry automatically
category: programming
tags:
  - dotnet
  - csharp
  - dns
  - dyndns
---

Occasionally I need to SSH into my home computer while I'm
out and about, so to make things easy I set up a DNS entry
to point to my home network. My router, like most routers,
supports a service called "dynamic DNS" where the router
periodically updates a DNS entry when it notices that it
has a new IP from my ISP. And it works: as long as that
service is dyndns.org. If you're familiar with DynDNS,
you may know that they shut down their free tier earlier
this year and since I have absolutely no interest (nor
need) to join their paid tier, I've been doing without.

I'd like to get that up an running again, so I decided to
do some digging into whether or not CPanel has its own API.
The [official documentation](https://documentation.cpanel.net/display/SDK/WHM+API+1+Functions)
was down when I did my initial research (I assumed it was
offline for good), but apparently it's back up now. In any
case, I was able to use Google Cache to find the Zone Edit
feature. Next, all you have to do is place this script on
a server within the network and register it with cron /
Windows Scheduler and your DNS entry will be periodically
updated with your public IP address.

As usual, you can test the following code in
[LINQPad](http://www.linqpad.net/) with the "C# Program" language:

```csharp
async void Main()
{
	var user = "";
	var pass = "";
	var cpanelDomain = "www.myhost.com";
	var baseDomain = "nem.ec";
	var domainToEdit = "example.nem.ec.";  // keep the trailing .
	var newAddress = await GetCurrentIpAddress();
	
	var baseUrl = String.Format(
        "https://{0}:2083/xml-api/cpanel?cpanel_xmlapi_module=ZoneEdit&domain={1}",
        cpanelDomain, 
        baseDomain);
	
	var client = new HttpClient();
	client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
        Convert.ToBase64String(
            Encoding.ASCII.GetBytes(String.Format("{0}:{1}", user, pass))));
	var url = baseUrl + "&cpanel_xmlapi_func=fetchzone";
	
	var resp = await client.GetAsync(url);
	resp.EnsureSuccessStatusCode();
	var stream = await resp.Content.ReadAsStreamAsync();
	
	var doc = XDocument.Load(stream);
	
    // Grab the first result where the domain name is the name
    // we're looking for.
	var record = doc
		.Element("cpanelresult")
		.Element("data")
		.Elements("record")
		.FirstOrDefault(r => 
			r.Elements("name").Any(e => 
				e.Value == domainToEdit));
	
	if(record != null)
	{
		Console.WriteLine("Replacing old address '{0}' with '{1}'", 
			record.Element("address").Value,
			newAddress);
		var lineNumber = record.Element("line").Value;
        
        // Line number is the "primary key" of the record,
        // at least as far as the API is concerned.
		var editUrl = baseUrl + String.Format(
			"&cpanel_xmlapi_func=edit_zone_record&line={0}&address={1}",
			lineNumber,
			newAddress);
		resp = await client.GetAsync(editUrl);
		resp.EnsureSuccessStatusCode();
		Console.WriteLine("Changed address.");
	}
	else
	{
		Console.WriteLine("No record available.");
	}
}

// Polls icanhazip for the current public IP address.
async Task<string> GetCurrentIpAddress()
{
	var client = new HttpClient();
	var resp = await client.GetAsync("https://icanhazip.com/");
	return await resp.Content.ReadAsStringAsync();
}
```
