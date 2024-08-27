"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHORIZATION_URL = exports.LOGO_URL = exports.PersonaState = exports.CommunityVisibilityState = exports.EMAIL_DOMAIN = exports.PROVIDER_NAME = exports.PROVIDER_ID = void 0;
exports.PROVIDER_ID = 'steam';
exports.PROVIDER_NAME = 'Steam';
exports.EMAIL_DOMAIN = 'steamcommunity.com';
var CommunityVisibilityState;
(function (CommunityVisibilityState) {
    CommunityVisibilityState[CommunityVisibilityState["Private"] = 1] = "Private";
    CommunityVisibilityState[CommunityVisibilityState["Public"] = 3] = "Public";
})(CommunityVisibilityState || (exports.CommunityVisibilityState = CommunityVisibilityState = {}));
var PersonaState;
(function (PersonaState) {
    PersonaState[PersonaState["Offline"] = 0] = "Offline";
    PersonaState[PersonaState["Online"] = 1] = "Online";
    PersonaState[PersonaState["Busy"] = 2] = "Busy";
    PersonaState[PersonaState["Away"] = 3] = "Away";
    PersonaState[PersonaState["Snooze"] = 4] = "Snooze";
    PersonaState[PersonaState["LookingToTrade"] = 5] = "LookingToTrade";
    PersonaState[PersonaState["LookingToPlay"] = 6] = "LookingToPlay";
})(PersonaState || (exports.PersonaState = PersonaState = {}));
exports.LOGO_URL = 'https://raw.githubusercontent.com/Nekonyx/next-auth-steam/bc574bb62be70993c29f6f54c350bdf64205962a/logo/steam-icon-light.svg';
exports.AUTHORIZATION_URL = 'https://steamcommunity.com/openid/login';
