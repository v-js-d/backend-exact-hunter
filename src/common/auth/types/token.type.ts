/**
 * Access + refresh strings returned to the client (e.g. cookies).
 * `refreshToken` is the opaque secret sent to the browser; the DB stores only its hash.
 */
export interface AuthTokenPair {
	accessToken: string;
	refreshToken: string;
}
