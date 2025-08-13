export const oktaConfig = {
  clientId: '0oap525ydtG2YwxWL1d7', // Replace with your Okta client ID
  issuer: 'https://sherwindemo.oktapreview.com/oauth2/default', // Replace with your Okta domain
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
}; 