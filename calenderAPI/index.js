const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token_bhupesh.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials_bhupesh.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function createEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  var event = {
      'summary' : 'Aviral Scaler Project development',
      'description' : 'Event test 1:13 AM',
      'conferenceDataVersion': 1,
      'start' : {'dateTime' : '2022-09-26T22:00:00', 'timeZone': 'Asia/Kolkata'},
      'end' : {'dateTime' : '2022-09-26T23:00:00', 'timeZone': 'Asia/Kolkata'},
      'conferenceData': {
          'createRequest': {
              'conferenceSolutionKey': {
                  'type': 'hangoutsMeet'
              },
              'requestId': 'abc-cdef-efg'
          }
      },
      'attendees' : [
          {'email': 'bhupeshsardana01@gmail.com'},
          {'email': 'aryandhakad1@gmail.com'},
      ]
  }
  // var updated_event = {
  //     'summary' : 'Scaler Project development',
  //     'description' : 'aryan has to develop the whole app meanwhile aviral and bhupesh will be the cheerleaders. Tejas also joined as cheerleader',
  //     'conferenceDataVersion': 1,
  //     'start' : {'dateTime' : '2022-09-26T22:00:00', 'timeZone': 'Asia/Kolkata'},
  //     'end' : {'dateTime' : '2022-09-26T23:00:00', 'timeZone': 'Asia/Kolkata'},
  //     // 'conferenceData': {
  //     //     'createRequest': {
  //     //         'conferenceSolutionKey': {
  //     //             'type': 'hangoutsMeet'
  //     //         },
  //     //         'requestId': 'RandomString'
  //     //     }
  //     // },
  //     'conferenceData': {
  //   'createRequest': {
  //     'conferenceSolutionKey': {
  //       'type': 'hangoutsMeet'
  //     },
  //     requestId: 'coding-calendar-demo'
  //   }
  // },
  //     'attendees' : [
  //         {'email': 'bhupeshsardana01@gmail.com'},
  //         {'email': 'aryandhakad1@gmail.com'},
  //     ]
  // }
  // calendar.events.insert({
  //   auth: auth,
  //   calendarId: 'primary',
  //   resource: event,
  //   conferenceDataVersion: 1,
  //   sendNotifications: true,
  // }, function(err, event) {
  //     if (err) {
  //       console.log('There was an error contacting the Calendar service: ' + err);
  //       return;
  //     }
  //     console.log('Event created: %s', JSON.stringify(event));
  // });
  
  calendar.events.delete({
    calendarId: 'primary',
    eventId : 'jav23fddhu04340918biq6rvi0',
  });
}

authorize().then(createEvents).catch(console.error);