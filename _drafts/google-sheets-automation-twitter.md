---
layout: post
title: Google Sheets Automation - Expand Twitter Links
description: 
category: infosec
tags:
  - osint
  - google-sheets
  - twitter
headerImage: 2020/05/port-scan-header.png
headerImageAttrib: image credit - bitninja.io
#editNotes:
#  - Edited 2021-01-01 for clarity
---

https://blog.twitter.com/developer/en_us/topics/tips/2020/the-tweet-formula-for-google-sheets

https://webapps.stackexchange.com/questions/135653/how-to-embed-a-google-map-of-an-address-into-a-google-sheet

https://developer.twitter.com/en/docs/tutorials/how-to-store-streaming-tweets-in-a-google-sheet


Reference: https://twitter.com/bellingcat/status/1347601342748102657

https://developers.google.com/apps-script/reference/spreadsheet/range#copyTo(Range)

https://developer.twitter.com/en/portal/dashboard

Is Valid Tweet?
```
=IF(ISBLANK(B2), "", IS_VALID_TWEET_URL(B2))
```

Tweet Text
```
=IF(ISBLANK(B2), "", IF(C2="x", "", TWEET(B2)))
```

Tweet Author
```
=IF(ISBLANK(B2), "", IF(C2="x", "", TWEET_AUTHOR(B2)))
```

Tweet Author ID
```
=IF(ISBLANK(B2), "", IF(C2="x", "", TWEET_AUTHOR_ID(B2)))
```

Tweet Media Preview URL
```
=IF(ISBLANK(B2), "", IF(C2="x", "", FIRST_MEDIA_OF_TWEET(B2)))
```

Tweet Media Preview
```
=IF(ISBLANK(F2), "", IF(C2="x", "", IMAGE(F2, 4, 180, 320)))
```




Twitter.gs
```
// @OnlyCurrentDoc

const BearerTokenKey = 'twitterBearerToken';

function onOpen() {
  SpreadsheetApp
    .getUi()
    .createMenu('Twitter')
    .addItem('Set Bearer token', 'helpers.requestBearerToken')
    .addItem('Sign out', 'helpers.logout')
    .addToUi();
}

const helpers = {};
helpers.bearerToken = () => PropertiesService.getScriptProperties().getProperty(BearerTokenKey);
helpers.tweet = (id) => JSON.parse(PropertiesService.getScriptProperties().getProperty(`tweet-${id}`));
helpers.checkBearerToken = () => {
  if (!helpers.bearerToken()) {
    throw new Error('You need to set a Bearer token before using this function. Select "Set Bearer Token" from the Twitter menu to set it.');
  }
}

helpers.lookupUser = (tweet) => {
  const authorId = tweet.data.author_id;
  let author = {};
  for (const user of tweet.includes.users) {
    if (user.id === authorId) {
      author = user;
      return user;
    }
  }
    
  return {};
}

helpers.logout = () => PropertiesService.getScriptProperties().deleteAllProperties();
  
helpers.tweetIdFromURL = (url) => {
    const twitterRegex = url.match(new RegExp('^(https?://)?twitter.com'));
    if (!twitterRegex) {
      throw new Error('URL is not from Twitter');
    }
    const tweetRegex = url.match(/status\/(\d{1,19})/);
    if (!tweetRegex) {
      throw new Error('Twitter URL is not a Tweet link');
    }
    
    return tweetRegex[1];
  }

helpers.requestBearerToken = () => {
  // Build the input prompt
  const ui = SpreadsheetApp.getUi(); 
  const result = ui.prompt(
    'Bearer token',
    'A Bearer token is the access token to make requests to the Twitter API.\nYou can find the Bearer token in your Twitter Developer Portal under Keys and Tokens.\n\nPaste the Bearer token here:', 
    ui.ButtonSet.OK);
  
  // Proceed if the user clicked OK
  if (result.getSelectedButton() == ui.Button.OK) {
    const bearerToken = result.getResponseText().trim();
    
    // Do nothing if the user clicked OK without specifying a value
    // (we can always ask for a token later)
    if (bearerToken.length > 0) {
      const properties = PropertiesService.getScriptProperties();
      properties.setProperty(BearerTokenKey, bearerToken);
    }
  }
}

helpers.lookupMedia = (tweet) => {
  if (!(tweet.data.attachments && tweet.data.attachments.media_keys)) {
    return;
  }

  if (!(tweet.includes && tweet.includes.media)) {
    return;
  }
  const keys = tweet.data.attachments.media_keys;
  const media = tweet.includes.media.filter(item => keys.includes(item.media_key));
  return media.map(item => item.url || item.preview_image_url);
}

helpers.tweet = (tweetId) => {
  helpers.checkBearerToken();  
  const lookupURL = `https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id,attachments.media_keys&user.fields=description&media.fields=url,preview_image_url`;
  const response = UrlFetchApp.fetch(
    lookupURL, {
    headers: {
     'Authorization': `Bearer ${helpers.bearerToken()}`
    }
  });
  
  const tweet = JSON.parse(response.getContentText());    
  if (tweet.errors && !tweet.data) {
    throw new Error(JSON.stringify(tweet.errors));
  }

  return tweet;
}

/**
 * Return tweet text from tweet url.
 *
 * @param {String} url The url of a tweet.
 * @return The tweet text.
 * @customfunction
 */
function TWEET(url) { 
  const tweetId = helpers.tweetIdFromURL(url);
  const tweet = helpers.tweet(tweetId);
  return tweet.data.text;
}

/**
 * Return the author from tweet url.
 *
 * @param {String} url The url of a tweet.
 * @return The tweet author.
 * @customfunction
 */
function TWEET_AUTHOR(tweetURL) {
  const tweetId = helpers.tweetIdFromURL(tweetURL);
  const tweet = helpers.tweet(tweetId);
  const user = helpers.lookupUser(tweet);
  return user.username || '';
}

/**
 * Return the author ID from tweet url.
 *
 * @param {String} url The url of a tweet.
 * @return The tweet author's unique ID.
 * @customfunction
 */
function TWEET_AUTHOR_ID(tweetURL) {
  const tweetId = helpers.tweetIdFromURL(tweetURL);
  const tweet = helpers.tweet(tweetId);
  const user = helpers.lookupUser(tweet);
  return user.id || '';
}

/**
 * Return the bio of the author from tweet url.
 *
 * @param {String} url The url of a tweet.
 * @return The tweet author's bio.
 * @customfunction
 */
function BIO_OF_TWEET_AUTHOR(tweetURL) {
  const tweetId = helpers.tweetIdFromURL(tweetURL);
  const tweet = helpers.tweet(tweetId);
  const user = helpers.lookupUser(tweet);
  return user.description || '';
}

/**
 * Return the media from tweet url.
 *
 * @param {String} url The url of a tweet.
 * @return The media within a tweet.
 * @customfunction
 */
function MEDIA_OF_TWEET(tweetURL) {
  const tweetId = helpers.tweetIdFromURL(tweetURL);
  const tweet = helpers.tweet(tweetId);
  return helpers.lookupMedia(tweet);
}

/**
 * Return the first media from tweet url.
 *
 * @param {String} url The url of a tweet.
 * @return The first media within a tweet.
 * @customfunction
 */
function FIRST_MEDIA_OF_TWEET(tweetURL) {
  const tweetId = helpers.tweetIdFromURL(tweetURL);
  const tweet = helpers.tweet(tweetId);
  var media = helpers.lookupMedia(tweet);
  if (media !== undefined && media.length > 0) {
    return media[0];
  }
  return "";
}

/**
 * Return a ✓ if Tweet URL is valid, otherwise x.
 *
 * @param {String} url The url of a tweet.
 * @return ✓ or x.
 * @customfunction
 */
function IS_VALID_TWEET_URL(tweetURL) {
  try {
    helpers.tweetIdFromURL(tweetURL);
    return '✓';
  }
  catch {
    return 'x';
  }
}

function activateFormTrigger() {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("onFormSubmit")
    .forSpreadsheet(sheet)
    .onFormSubmit()
    .create();
}

function onFormSubmit(event) {
  //const firstRow = 2;
  const firstColumnWithFormulas = 3;
  // Update formulas in rows

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var formulaRange = sheet.getRange(
    lastRow,  // this row should have the formula already applied
    firstColumnWithFormulas,
    1,
    lastCol - firstColumnWithFormulas + 1);
  
  var editedStart = event.range.getRow();
  var editedHeight = event.range.getHeight();

  var applyRange = sheet.getRange(
    editedStart,
    firstColumnWithFormulas,
    editedHeight,
    lastCol - firstColumnWithFormulas + 1);

  //var formulas = formulaRange.getFormulas();
  //applyRange.setFormulas(formulas);
  formulaRange.copyTo(applyRange);
}
```
