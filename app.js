const express = require('express');

const app = express();
const port = 8888;

const TRUELAYER_CLIENT_ID = '';
const TRUELAYER_CLIENT_SECRET = '';
const TRUELAYER_REDIRECT_URI = 'https://console.truelayer.com/redirect-page';
const TRUELAYER_CODE = '';
const scope = 'accounts balance transactions offline_access';

app.get('/connect', (req, res) => {
  const authUrl = `https://auth.truelayer-sandbox.com?response_type=code&client_id=${TRUELAYER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    TRUELAYER_REDIRECT_URI,
  )}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  try {
    const tokenResponse = await fetch(
      'https://auth.truelayer-sandbox.com/connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: TRUELAYER_CLIENT_ID,
          client_secret: TRUELAYER_CLIENT_SECRET,
          redirect_uri: TRUELAYER_REDIRECT_URI,
          code: TRUELAYER_CODE,
        }),
      },
    );

    const data = await tokenResponse.json();
    console.log('logging -> ', { data });

    res.status(200).send(data);
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
