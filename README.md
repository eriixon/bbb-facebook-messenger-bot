# Facebook Messenger Bot for Better Business Bureau
## Description.
This bot was created under the order from Better Business Bureau to provide services of BBB to Facebook users. The main service of the bot is to help users find an appropriate business in the US. In the future this bot should be available in Canada.
## Project Guidelines
- Simple - very user friendly
- Lightweight - Small file and memory footprint
- Flexible - Very easy to maintain

## How to use
* Go to [Better Business Bureau page](https://www.facebook.com/BBBSnakeRiverRegion)
* Messenger site [Direct Link](https://www.messenger.com/t/BBBSnakeRiverRegion)

In the first visit just click "Get started" and follow tips.

## Technologies
This bot works under Node JS server and JavaScript code. The index page is used for test needs.
Also this bot uses several APIs:
1. [BBB API](https://developer.bbb.org/) to look for information about some business in BBB data base
2. [Messenger API](https://developers.facebook.com/products/messenger/) to send messages from bot to users thought Messenger
3. [Google maps API](https://developers.google.com/maps/documentation/geocoding/intro) to find the name of user's location

Also it uses the NPM packages:
1.   @google/maps - for Google maps API
2.   body-parser - for Facebook verification
3.   config - for keeping tokens and keys
4.   es6-promise - for fetch
5.   express - for server Node JS
6.   isomorphic-fetch - for promises
7.   levenshtein-edit-distance - to correct errors of input
8.   nodemailer - for sending emails to Facebook page admins

## How to set up
At the first step you need to set up an application at Facebook Developer site. Following the [walk-through](https://developers.facebook.com/docs/messenger-platform/quickstart) in more detail.

The second step is to download the bot, initialize npm packages (*$npm init*) and deploy a server which can support NodeJS server (for example Heroku.com).

The last step is to obtain tokens, put them to default.js in config directory (needs to be created):
```
"MESSENGER_APP_SECRET": "***",
    "MESSENGER_VALIDATION_TOKEN": "***",
    "MESSENGER_PAGE_ACCESS_TOKEN": "***D",
    "GM_KEY" : "***",
    "BBB_TOKEN": "***",
    "AGENT_EMAIL":"***",
    "ADMIN_EMAIL":"***",
    "FINDER_PASS":"***",
    "BOT_EMAIL":"***",
    "SERVER_URL": "***"
```
and pages.js (list of pages which can use the bot):
```
module.exports=Object.freeze({
    PAGE_ID: {
        name:"PAGE_NAME",
        page_token:"PAGE_TOKEN"
    }
});
```
For sending email it is necessary to create a new Gmail account (BOT_EMAIL).

## Version
The current version is 4.1. The last version 4.3. and can be used ONLY for BBB needs.
## License
See the LICENSE file in the root directory of this source tree. Feel free to use and modify the code.