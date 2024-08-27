import type { NextApiRequest } from 'next';
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';
import type { NextRequest } from 'next/server';
import type { SteamProfile } from './types';
export interface SteamProviderOptions extends Partial<OAuthUserConfig<SteamProfile>> {
    /** @example 'https://example.com/api/auth/callback' */
    callbackUrl: string | URL;
    /** @example 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' */
    clientSecret: string;
}
export declare function Steam(req: Request | NextRequest | NextApiRequest, options: SteamProviderOptions): OAuthConfig<SteamProfile>;
