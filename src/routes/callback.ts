import { Router } from 'express';
import CONFIG, { requestClient } from '../config';
import { asyncWrapOrError } from '../utils';

export const callbackRouter = Router();

// -- FLOW 1: --
// -- Callback flow --

// Serve HTML index page with callback link
callbackRouter.get('/', (req, res) => {
  const uri = `http://localhost:${CONFIG.PORT}/callback`;
  const link = requestClient.generateOAuth2AuthLink(uri, {
    scope: [
      'account.follows.read', 'account.follows.write',
      'offline.access',  'tweet.read', 'users.read',
      // spaces.read don't work now (2021-09-30)
    ],
  });
  // Save token secret to use it after callback
  req.session.state = link.state;
  req.session.codeVerifier = link.codeVerifier;
  req.session.redirectUri = uri;

  res.render('index', { authLink: link.url });
});

// Read data from Twitter callback
callbackRouter.get('/callback', asyncWrapOrError(async (req, res) => {
  // Invalid request
  if (!req.query.state || !req.query.code) {
    res.status(400).render('error', { error: 'Bad request, or you denied application access. Please renew your request.' });
    return;
  }

  const state = req.query.state as string;
  const code = req.query.code as string;
  const savedState = req.session.state;
  const savedVerifier = req.session.codeVerifier;
  const redirectUri = req.session.redirectUri;

  if (!savedState || !redirectUri || !savedVerifier || savedState !== state) {
    res.status(400).render('error', { error: 'OAuth token is not known or invalid. Your request may have expire. Please renew the auth process.' });
    return;
  }

  // Get the definitive client
  const { client: userClient, accessToken, refreshToken, expiresIn } = await requestClient.loginWithOAuth2({
    code,
    codeVerifier: savedVerifier,
    redirectUri,
  });

  // You can store {accessToken} and use it until {expiresIn} is not hit.
  // Warning: after {expiresIn} is hit, you must use {refreshToken} to get a new OAuth2 token

  // You can create new instances with accessToken directly:
  // const freshInstance = new TwitterApi(accessToken);

  // You can refresh token with .refreshOAuth2Token (same result as .loginWithOAuth2())
  // const { client: renewedInstance, accessToken: newAccessToken } = await requestClient.refreshOAuth2Token(refreshToken!);

  // For now, you cannot obtain user informations (user id, screen name...) from OAuth2 user-token, but it will come :)

  res.render('callback', { accessToken });
}));

export default callbackRouter;
