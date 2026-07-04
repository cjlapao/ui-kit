// crypto-js types are available in react/node_modules/@types/crypto-js/
// but not resolvable from the shared common/ directory. We declare the
// minimal shape we need to avoid the TS2307 module resolution error.
declare const CryptoJS: {
  MD5(message: string): { toString(): string };
};

/**
 * Returns a Gravatar URL for the given email.
 *
 * @param email - The user's email address.
 * @param size  - Image size in pixels (default 200).
 * @param defaultImage - Gravatar fallback when no image exists.
 *   Common values: `'404'` (return HTTP 404), `'mp'` (mystery-person silhouette),
 *   `'identicon'` (geometric pattern), `'retro'` (8-bit style).
 *   Defaults to `'mp'` so a valid image is always returned.
 */
export const getGravatarUrl = (
  email: string,
  size: number = 200,
  defaultImage: string = "mp",
): string => {
  const trimmedEmail = email.trim().toLowerCase();
  const hash = CryptoJS.MD5(trimmedEmail).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};
