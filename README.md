# twitter-api-v2-user2-oauth-example

This project shows you how to make a simple 3-legged OAuth2 user flow (BETA).

## Requirements

### Packages

Install all packages of project, configure .env with required properties, then start TypeScript compiler.

```bash
npm i
cp .example.env .env
# ...configure .env with consumer keys
# then start the server
npm run start
```

### Twitter app config

- Copy `.example.env` to `.env` file
- Add your consumer key + consumer secret to `.env` file
- Ensure `http://localhost:5000/callback` is present in allowed callback URLs, inside your Twitter application settings (in developer portal).

## Testing the app

Navigate to `http://localhost:5000` to test **callback-based flow**.

## How it works

### Callback flow

1) It generate a authentification link (`routes/callback.ts`, `router.get('/')`) that renders into `views/index.ejs`.
2) User clicks link, and is redirected to `routes/callback.ts`, `router.get('/callback')` route.
3) Route use stored tokens into session to generate definitive access token, then renders `views/callback.ejs` with access token data.
