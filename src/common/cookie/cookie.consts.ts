import { CookieOptions } from 'express';

/** Optional; omit cookie `domain` when unset (same host only). */
export const AUTH_COOKIE_DOMAIN_ENV_KEY = 'AUTH_COOKIE_DOMAIN';

export const ACCESS_COOKIE_NAME_ENV_KEY = 'ACCESS_COOKIE_NAME';
export const REFRESH_COOKIE_NAME_ENV_KEY = 'REFRESH_COOKIE_NAME';

export const AUTH_COOKIE_SECURE_ENV_KEY = 'AUTH_COOKIE_SECURE';
export const NODE_ENV_ENV_KEY = 'NODE_ENV';

export const DEFAULT_ACCESS_COOKIE_NAME = 'access_token';
export const DEFAULT_REFRESH_COOKIE_NAME = 'refresh_token';

export const SAME_SITE_LAX: CookieOptions['sameSite'] = 'lax'; // настройка для однонго домена разных поддоменов
export const SAME_SITE_DEV: CookieOptions['sameSite'] = 'none'; // настройка для разработки для разных доменов
export const COOKIE_PATH_ROOT = '/';
export const BOOLEAN_TRUE_STRING = 'true';
export const BOOLEAN_FALSE_STRING = 'false';
export const NODE_ENV_PRODUCTION = 'production';
