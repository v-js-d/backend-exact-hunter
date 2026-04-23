import { CookieOptions } from 'express';

/** Optional; omit cookie `domain` when unset (same host only). */
export const AUTH_COOKIE_DOMAIN_ENV_KEY = 'AUTH_COOKIE_DOMAIN';

export const CANDIDATE_ACCESS_COOKIE_NAME_ENV_KEY = 'CANDIDATE_ACCESS_COOKIE_NAME';
export const CANDIDATE_REFRESH_COOKIE_NAME_ENV_KEY = 'CANDIDATE_REFRESH_COOKIE_NAME';
export const EMPLOYER_ACCESS_COOKIE_NAME_ENV_KEY = 'EMPLOYER_ACCESS_COOKIE_NAME';
export const EMPLOYER_REFRESH_COOKIE_NAME_ENV_KEY = 'EMPLOYER_REFRESH_COOKIE_NAME';

export const AUTH_COOKIE_SECURE_ENV_KEY = 'AUTH_COOKIE_SECURE';
export const NODE_ENV_ENV_KEY = 'NODE_ENV';

export const DEFAULT_CANDIDATE_ACCESS_COOKIE_NAME = 'candidate_access_token';
export const DEFAULT_CANDIDATE_REFRESH_COOKIE_NAME = 'candidate_refresh_token';
export const DEFAULT_EMPLOYER_ACCESS_COOKIE_NAME = 'employer_access_token';
export const DEFAULT_EMPLOYER_REFRESH_COOKIE_NAME = 'employer_refresh_token';

export const SAME_SITE_LAX: CookieOptions['sameSite'] = 'lax';
export const COOKIE_PATH_ROOT = '/';
export const BOOLEAN_TRUE_STRING = 'true';
export const BOOLEAN_FALSE_STRING = 'false';
export const NODE_ENV_PRODUCTION = 'production';
