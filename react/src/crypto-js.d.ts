// Declaration file for crypto-js (used by shared common/utils/gravatar.ts)
// crypto-js ships with its own type definitions in node_modules/@types/crypto-js/
// but the moduleResolution 'bundler' in tsconfig.json doesn't find them from
// the common/ directory since it's outside react/node_modules.
// This ambient declaration bridges the gap.
declare module "crypto-js" {
  namespace CryptoJS {
    function MD5(message: string): CryptoJS.lib.WordArray;
  }
  export default CryptoJS;
}