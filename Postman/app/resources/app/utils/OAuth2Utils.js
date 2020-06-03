const crypto = require('crypto');

/**
 * Base64url Encoding without Padding
 *
 * @see https://tools.ietf.org/html/rfc7636#page-17
 *
 * @param {Buffer} buffer
 */
const base64urlencode = (buffer) => {
  let encodedString = buffer.toString('base64');

  encodedString = encodedString.split('=')[0];
  encodedString = encodedString.replace(/\+/g, '-');
  encodedString = encodedString.replace(/\//g, '_');

  return encodedString;
};

/**
 * Generate Code Verifier for OAuth2.0 Proof Key for Code Exchange flow.
 * 32-octet sequence generates code verifier having length of 43.
 *
 * @see https://tools.ietf.org/html/rfc7636#page-8
 *
 * @param {Number} [length=32]  It is the length of octets from which code verifier will be generated
 */
const generateCodeVerifier = (length = 32) => {
  const buffer = crypto.randomBytes(length);

  return base64urlencode(buffer);
};

/**
 * Generate code challenge from code verifier.
 *
 * @param {String} codeVerifier
 * @param {String} codeChallengeMethod
 */
const getCodeChallenge = (codeVerifier, codeChallengeMethod) => {
  if (!codeVerifier || codeChallengeMethod === 'plain') {
    return codeVerifier || '';
  }
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();

  return base64urlencode(hash);
};

module.exports = {
  generateCodeVerifier,
  getCodeChallenge
};
