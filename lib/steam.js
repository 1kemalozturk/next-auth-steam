"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steam = Steam;
const crypto_1 = require("crypto");
const openid_1 = require("openid");
const openid_client_1 = require("openid-client");
const constants_1 = require("./constants");
function Steam(req, options) {
    const callbackUrl = new URL(options.callbackUrl);
    // https://example.com
    // https://example.com/api/auth/callback/steam
    const realm = callbackUrl.origin;
    const returnTo = `${callbackUrl.href}/${constants_1.PROVIDER_ID}`;
    if (!options.clientSecret || options.clientSecret.length < 1) {
        throw new Error('You have forgot to set your Steam API Key in the `clientSecret` option. Please visit https://steamcommunity.com/dev/apikey to get one.');
    }
    return {
        options: options,
        id: constants_1.PROVIDER_ID,
        name: constants_1.PROVIDER_NAME,
        type: 'oauth',
        style: {
            logo: constants_1.LOGO_URL,
            logoDark: constants_1.LOGO_URL,
            bg: '#000',
            text: '#fff',
            bgDark: '#000',
            textDark: '#fff'
        },
        idToken: false,
        checks: ['none'],
        clientId: constants_1.PROVIDER_ID,
        authorization: {
            url: constants_1.AUTHORIZATION_URL,
            params: {
                'openid.mode': 'checkid_setup',
                'openid.ns': 'http://specs.openid.net/auth/2.0',
                'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
                'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
                'openid.return_to': returnTo,
                'openid.realm': realm
            }
        },
        token: {
            async request() {
                if (!req.url) {
                    throw new Error('No URL found in request object');
                }
                const identifier = await verifyAssertion(req, realm, returnTo);
                if (!identifier) {
                    throw new Error('Unauthenticated');
                }
                return {
                    tokens: new openid_client_1.TokenSet({
                        id_token: (0, crypto_1.randomUUID)(),
                        access_token: (0, crypto_1.randomUUID)(),
                        steamId: identifier
                    })
                };
            }
        },
        userinfo: {
            async request(ctx) {
                const url = new URL('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002');
                url.searchParams.set('key', ctx.provider.clientSecret);
                url.searchParams.set('steamids', ctx.tokens.steamId);
                const response = await fetch(url);
                const data = await response.json();
                return data.response.players[0];
            }
        },
        profile(profile) {
            // next.js can't serialize the session if email is missing or null, so I specify user ID
            return {
                id: profile.steamid,
                image: profile.avatarfull,
                email: `${profile.steamid}@${constants_1.EMAIL_DOMAIN}`,
                name: profile.personaname
            };
        }
    };
}
/**
 * Verifies an assertion and returns the claimed identifier if authenticated, otherwise null.
 */
async function verifyAssertion(req, realm, returnTo) {
    // Here and from here on out, much of the validation will be related to this PR: https://github.com/liamcurry/passport-steam/pull/120.
    // And accordingly copy the logic from this library: https://github.com/liamcurry/passport-steam/blob/dcebba52d02ce2a12c7d27481490c4ee0bd1ae38/lib/passport-steam/strategy.js#L93
    const IDENTIFIER_PATTERN = /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/;
    const OPENID_CHECK = {
        ns: 'http://specs.openid.net/auth/2.0',
        claimed_id: 'https://steamcommunity.com/openid/id/',
        identity: 'https://steamcommunity.com/openid/id/'
    };
    // We need to create a new URL object to parse the query string
    // req.url in next@14 is an absolute url, but not in next@13, so example.com used as a base url
    const url = new URL(req.url, 'https://example.com');
    const query = Object.fromEntries(url.searchParams.entries());
    if (query['openid.op_endpoint'] !== constants_1.AUTHORIZATION_URL || query['openid.ns'] !== OPENID_CHECK.ns) {
        return null;
    }
    if (!query['openid.claimed_id']?.startsWith(OPENID_CHECK.claimed_id)) {
        return null;
    }
    if (!query['openid.identity']?.startsWith(OPENID_CHECK.identity)) {
        return null;
    }
    const relyingParty = new openid_1.RelyingParty(returnTo, realm, true, false, []);
    const assertion = await new Promise((resolve, reject) => {
        relyingParty.verifyAssertion(req, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
    if (!assertion.authenticated || !assertion.claimedIdentifier) {
        return null;
    }
    const match = assertion.claimedIdentifier.match(IDENTIFIER_PATTERN);
    if (!match) {
        return null;
    }
    return match[1];
}
