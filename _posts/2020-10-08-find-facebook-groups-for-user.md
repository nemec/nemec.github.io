---
layout: post
title: Finding Facebook Groups a User Belongs to and Admins
category: infosec
tags:
  - infosec
  - osint
headerImage: 2020/08/fb-group-header.png
#headerImageAttrib: image credit - bitninja.io
---

## Intro

Howdy! Today's post is brought to you by a tip from
[@technisette](https://twitter.com/technisette). A couple of months ago she
sent me a link to a Chrome extension that had some cool Facebook tools
integrated. After a short time using the extension, the research account she'd
been using was terminated by Facebook and she was looking for a way to
replicate the "Find Groups for User" feature without the risk of running the
extension. The following guide shows how it's done and doesn't require any
coding, only two tools: Browser Dev Tools and the [Postman API developer
GUI](https://www.postman.com/). Screenshots in this post will be in Firefox -
Chrome or Edge will look slightly different, but should have similar naming.

## Postman Setup

Postman is a program for making manual HTTP requests against third-party APIs.
[Download the program](https://www.postman.com/downloads/) and, if it prompts
you to install, install it. Otherwise, just unzip and run the Postman program.

Open Postman, then click the **File** menu, then the **Import** option.

![Screenshot showing the File -> Import... menu in Postman to import a Postman collection](/images/2020/08/import-collection-menu.png)

On the Import menu, click the **Link** tab and paste the following link:
`https://www.postman.com/collections/f3470ae065c34fb42a59`. Then continue and
finish importing the collection.

![Screenshot showing the Link tab in the import dialog](/images/2020/08/import-collection-link.png)

After importing the collection, check the bar on the far left of the window and
click the **Collections** tab if it is not selected. The import step created a
folder named **Facebook**, click on the arrow next to it. Finally, click on the
request item named **Groups for User**. This will open a tab in the main body
of the Postman window.

![Screenshot showing the left-hand side of the Postman UI where the imported collection can be found](/images/2020/08/open-request.png)

## Facebook Setup

In order to use this script, you must be "logged in" to Facebook. This requires
some data to be copied from a browser window where you've logged in to a
Facebook account. If possible, try to use a sockpuppet account for this just in
case Facebook decides to ban users caught using this technique.

### Target User ID

You will need the target's Facebook User/Profile ID. This can be found using
the instructions in the **Before we start...** section from [OSINT
Curious](https://osintcurio.us/2019/08/22/the-new-facebook-graph-search-part-1/)
or the [Who Posted What](https://whopostedwhat.com/) ID tool. Save this ID for
later.

### Cookies

In a browser window (screenshot below in Firefox), log in to
[facebook.com](https://www.facebook.com). Open your Browser Dev Tools (F12) and
choose the **Network** tab. Refresh any Facebook page and then select that page
request in the network tools.

Look in the **Headers** section for **Request Headers** and find the **Cookie**
section. Copy the *entire* cookie value (except the `Cookie:` part) into
another file for later use. Note that this contains your *own* Facebook user ID
and credentials that would allow another user to take over your Facebook
account, so don't share this Cookie with anyone else.

![Screenshot showing the section of Browser Dev Tools](/images/2020/08/copy-cookie.png)

### Additional Token

The final bit of Facebook data we need is called the `fb_dtsg` token. I'm not
entirely sure what it does or whether it is tied to a single user account, so I
recommend that you keep this token safe from others as well.

To get this token, you can view the page source for the Facebook home page when
logged in. Open
[`view-source:https://www.facebook.com`](view-source:https://www.facebook.com)
in your browser. Press **Ctrl+F** and search for the value `fb_dtsg`. There
should only be one search result and slightly to the right of the result will
be some text that says `value=` with more text in quotes. Copy that text within
quotes (but not the quotes themselves) to another file for later use. Make sure
to include any dashes, underscores, or colons in addition to the alphanumeric
text within quotes.

![Screenshot showing the section of the Facebook source code where the dtsg token lives](/images/2020/08/copy-dtsg.png)

## Making the Request

Back in Postman, select the **Headers** tab on the request. It will be
pre-filled with some values and the section for "cookie" will be labeled
"<insert_cookie_here>". Replace that text with the cookie value you copied from
Facebook.

![Postman UI with the Headers tab selected, showing where to put the cookie header](/images/2020/08/edit-cookie-header.png)

Next, switch to the **Body** tab. Replace the value "<insert_dtsg_value_here>"
with the dtsg text from Facebook and then in the "q" section, replace the ID
number after "node(" with the ID of your target profile. If 5000 groups is too
few (or too many) replace the number "5000" in the query section with a number
of your choice.

![Postman UI with the Body tab selected, showing where to put the dtsg value](/images/2020/08/edit-body.png)

Finally, click the "Send" button in the Postman UI. After a few second, the
bottom section should show a large mass of JSON text (see below).

![Screenshot of the Postman response UI with the raw, unformatted JSON text](/images/2020/08/json-text.png)

Format this text for easier viewing by clicking the button labeled "Text" and
choosing "JSON" from the drop-down. It will highlight the text and separate it
vertically.

![Screenshot of the Postman UI showing which buttons to click to format the JSON response text](/images/2020/08/format-json.png)

Once the text is formatted, look for lines labeled "name" and "url" to find the
group names and URLs that the user belongs to.

![Screenshot of the formatted response text containing a group name](/images/2020/08/group-data.png)

To see the groups a user is an admin of, scroll down near the bottom until you
reach a section titled "admined_groups". The groups that follow are the groups
that this user is an admin of.