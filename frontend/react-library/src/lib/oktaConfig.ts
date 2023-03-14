const clientId = process.env.REACT_APP_CLIENT_ID;
const issuer = process.env.REACT_APP_ISSUER;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
export const oktaConfig = {
    clientId: clientId,
    issuer: issuer,
    redirectUri: redirectUri,
    scopes: ["openid", "profile", "email"],
    pkce: true,
    disableHttpsCheck: true
}