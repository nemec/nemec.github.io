---
layout: post
title: Finding Facebook Groups a User Belongs to and Admins
category: infosec
tags:
  - infosec
  - osint
#headerImage: 2020/05/port-scan-header.png
#headerImageAttrib: image credit - bitninja.io
---

<h2>Postman Setup</h2>

<p>Step 1 is to download a program for making manual HTTP requests against third-party APIs named Postman. If it prompts you to install, install it. Otherwise, just unzip and run the Postman program.</p>

<p><a href="https://www.postman.com/downloads/">Link to Postman Website</a></p>

<p>Open Postman, then click the <b>File</b> menu, then the <b>Import</b> option.</p>

<img style="border:1px solid black" src="/images/2020/08/import-collection-menu.png" />

<p>On the Import menu, click the <b>Link</b> tab and then paste the following link: <code>https://www.postman.com/collections/e43f796b51d975126a39</code>. Then continue and finish importing the collection.</p>

<img style="border:1px solid black" src="/images/2020/08/import-collection-link.png" />

<p>After importing the collection, check the bar on the far left of the window and click the <b>Collections</b> tab if it is not selected. The import step created a folder named <b>Facebook</b>, click on the arrow next to it. Finally, click on the request item named <b>Groups for User</b>. This will open a tab in the main body of the Postman window.</p>

<img style="border:1px solid black" src="/images/2020/08/open-request.png" />

<h2>Facebook Setup</h2>

<p>In order to use this script, you must be "logged in" to Facebook. This requires some data to be copied from a browser window where you've logged in to a Facebook account. If possible, try to use a sockpuppet account for this just in case Facebook decides to ban users caught using this technique.</p>

<h3>Target User ID</h3>

<p>You will need the target's Facebook User/Profile ID. This can be found using the instructions in the <b>Before we start...</b> section from <a href="https://osintcurio.us/2019/08/22/the-new-facebook-graph-search-part-1/">OSINT Curious</a> or the <a href="https://whopostedwhat.com/">Who Posted What</a> ID tool. Save this ID for later.</p>

<h3>Cookies</h3>

<p>In a browser window (screenshot below in Firefox), log in to <a href="https://www.facebook.com">www.facebook.com</a>. Open your Browser Dev Tools (F12) and choose the <b>Network</b> tab. Refresh any Facebook page and then select that page request in the network tools.</p>

<p>Look in the <b>Headers</b> section for <b>Request Headers</b> and find the <b>Cookie</b> section. Copy the <i>entire</i> cookie value (except the <code>Cookie:</code> part) into another file for later use. Note that this contains your <i>own</i> Facebook user ID and credentials that would allow another user to take over your Facebook account, so don't share this Cookie with anyone else.</p>

<img style="border:1px solid black" src="/images/2020/08/copy-cookie.png" />

<h3>Additional Token</h3>

<p>The final bit of Facebook data we need is called the <code>fb_dtsg</code> token. I'm not entirely sure what it does or whether it is tied to a single user account, so I recommend that you keep this token safe from others as well.</p>

<p>To get this token, you can view the page source for the Facebook home page when logged in. Open <a href="view-source:https://www.facebook.com"><code>view-source:https://www.facebook.com</code></a> in your browser. Press <b>Ctrl+F</b> and search for the value <code>fb_dtsg</code>. There should only be one search result and slightly to the right of the result will be some text that says <code>value=</code> with more text in quotes. Copy that text within quotes (but not the quotes) to another file for later use. Make sure to include any dashes, underscores, or colons in addition to the alphanumeric text within quotes.</p>

<img style="border:1px solid black" src="/images/2020/08/copy-dtsg.png" />

<h2>Making the Request</h2>

<p>Back in Postman, select the <b>Headers</b> tab on the request. It will be pre-filled with some values and the section for "cookie" will be labeled "<insert_cookie_here>". Replace that text with the cookie value you copied from Facebook.</p>

<img style="border:1px solid black" src="/images/2020/08/edit-cookie-header.png" />

<p>Next, switch to the <b>Body</b> tab. Replace the value "<insert_dtsg_value_here>" with the dtsg text from Facebook and then in the "q" section, replace the ID number after "node(" with the ID of your target profile. If 5000 groups is too few (or too many) replace the number "5000" in the query section with a number of your choice.</p>

<img style="border:1px solid black" src="/images/2020/08/edit-body.png" />

<p>Finally, click the "Send" button in the Postman UI. After a few second, the bottom section should show a large mass of JSON text (see below).<p>

<img style="border:1px solid black" src="/images/2020/08/json-text.png" />

<p>Format this text for easier viewing by clicking the button labeled "Text" and choosing "JSON" from the drop-down. It will highlight the text and separate it vertically.</p>

<img style="border:1px solid black" src="/images/2020/08/format-json.png" />

<p>Once the text is formatted, look for lines labeled "name" and "url" to find the group names and URLs that the user belongs to.</p>

<img style="border:1px solid black" src="/images/2020/08/group-data.png" />

<p>To see the groups a user is an admin of, scroll down near the bottom until you reach a section titled "admined_groups". The groups that follow are the groups that this user is an admin of.</p>


<h2>Final Notes - Backup</h2>

<p>This file is a static HTML file with some images, so you can save this file to your computer/notes for safe keeping. Hit <b>Ctrl+S</b> in most browsers and choose "Web Page, complete" as the file type. This will download the HTML page and the attached images. Then open the <a href="https://www.postman.com/collections/e43f796b51d975126a39">Postman collection</a> in your browser. Save this file with any name you wish and a <b>.json</b> extension in the same place you're storing these instructions. To use the downloaded copy of the Postman collection, during the initial Import step choose the <b>File</b> tab instead of the <b>Link</b> tab and select the .json file you saved.</p>

</body>
