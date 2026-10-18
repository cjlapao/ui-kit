/**
 * Compact, self-contained MD5 (RFC 1321) — hex output.
 *
 * Gravatar is the only consumer and the shared common/ code cannot rely
 * on a bundler resolving crypto-js (it lives outside any package), so the
 * hash is implemented inline. The round structure and the
 * T[i] = (|sin(i+1)| · 2³²) | 0 constants mirror the battle-tested
 * crypto-js implementation; correctness is pinned against the standard
 * test vectors and node:crypto in the tests.
 */
const MD5_T = Int32Array.from(
  { length: 64 },
  (_, i) => (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0,
);

const MD5_FF = (
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number,
) => {
  const n = (a + ((b & c) | (~b & d)) + x + t) | 0;
  return ((((n << s) | (n >>> (32 - s))) + b)) | 0;
};
const MD5_GG = (
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number,
) => {
  const n = (a + ((b & d) | (c & ~d)) + x + t) | 0;
  return ((((n << s) | (n >>> (32 - s))) + b)) | 0;
};
const MD5_HH = (
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number,
) => {
  const n = (a + (b ^ c ^ d) + x + t) | 0;
  return ((((n << s) | (n >>> (32 - s))) + b)) | 0;
};
const MD5_II = (
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number,
) => {
  const n = (a + (c ^ (b | ~d)) + x + t) | 0;
  return ((((n << s) | (n >>> (32 - s))) + b)) | 0;
};

function md5Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const len = bytes.length;
  const paddedLen = (((len + 8) >> 6) + 1) << 6;
  const buf = new Uint8Array(paddedLen);
  buf.set(bytes);
  buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(paddedLen - 8, (len * 8) >>> 0, true);
  dv.setUint32(paddedLen - 4, Math.floor((len * 8) / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const M = new Int32Array(16);

  for (let off = 0; off < paddedLen; off += 64) {
    for (let i = 0; i < 16; i++) M[i] = dv.getInt32(off + 4 * i, true);
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    // Round 1
    a = MD5_FF(a, b, c, d, M[0], 7, MD5_T[0]);
    d = MD5_FF(d, a, b, c, M[1], 12, MD5_T[1]);
    c = MD5_FF(c, d, a, b, M[2], 17, MD5_T[2]);
    b = MD5_FF(b, c, d, a, M[3], 22, MD5_T[3]);
    a = MD5_FF(a, b, c, d, M[4], 7, MD5_T[4]);
    d = MD5_FF(d, a, b, c, M[5], 12, MD5_T[5]);
    c = MD5_FF(c, d, a, b, M[6], 17, MD5_T[6]);
    b = MD5_FF(b, c, d, a, M[7], 22, MD5_T[7]);
    a = MD5_FF(a, b, c, d, M[8], 7, MD5_T[8]);
    d = MD5_FF(d, a, b, c, M[9], 12, MD5_T[9]);
    c = MD5_FF(c, d, a, b, M[10], 17, MD5_T[10]);
    b = MD5_FF(b, c, d, a, M[11], 22, MD5_T[11]);
    a = MD5_FF(a, b, c, d, M[12], 7, MD5_T[12]);
    d = MD5_FF(d, a, b, c, M[13], 12, MD5_T[13]);
    c = MD5_FF(c, d, a, b, M[14], 17, MD5_T[14]);
    b = MD5_FF(b, c, d, a, M[15], 22, MD5_T[15]);
    // Round 2
    a = MD5_GG(a, b, c, d, M[1], 5, MD5_T[16]);
    d = MD5_GG(d, a, b, c, M[6], 9, MD5_T[17]);
    c = MD5_GG(c, d, a, b, M[11], 14, MD5_T[18]);
    b = MD5_GG(b, c, d, a, M[0], 20, MD5_T[19]);
    a = MD5_GG(a, b, c, d, M[5], 5, MD5_T[20]);
    d = MD5_GG(d, a, b, c, M[10], 9, MD5_T[21]);
    c = MD5_GG(c, d, a, b, M[15], 14, MD5_T[22]);
    b = MD5_GG(b, c, d, a, M[4], 20, MD5_T[23]);
    a = MD5_GG(a, b, c, d, M[9], 5, MD5_T[24]);
    d = MD5_GG(d, a, b, c, M[14], 9, MD5_T[25]);
    c = MD5_GG(c, d, a, b, M[3], 14, MD5_T[26]);
    b = MD5_GG(b, c, d, a, M[8], 20, MD5_T[27]);
    a = MD5_GG(a, b, c, d, M[13], 5, MD5_T[28]);
    d = MD5_GG(d, a, b, c, M[2], 9, MD5_T[29]);
    c = MD5_GG(c, d, a, b, M[7], 14, MD5_T[30]);
    b = MD5_GG(b, c, d, a, M[12], 20, MD5_T[31]);
    // Round 3
    a = MD5_HH(a, b, c, d, M[5], 4, MD5_T[32]);
    d = MD5_HH(d, a, b, c, M[8], 11, MD5_T[33]);
    c = MD5_HH(c, d, a, b, M[11], 16, MD5_T[34]);
    b = MD5_HH(b, c, d, a, M[14], 23, MD5_T[35]);
    a = MD5_HH(a, b, c, d, M[1], 4, MD5_T[36]);
    d = MD5_HH(d, a, b, c, M[4], 11, MD5_T[37]);
    c = MD5_HH(c, d, a, b, M[7], 16, MD5_T[38]);
    b = MD5_HH(b, c, d, a, M[10], 23, MD5_T[39]);
    a = MD5_HH(a, b, c, d, M[13], 4, MD5_T[40]);
    d = MD5_HH(d, a, b, c, M[0], 11, MD5_T[41]);
    c = MD5_HH(c, d, a, b, M[3], 16, MD5_T[42]);
    b = MD5_HH(b, c, d, a, M[6], 23, MD5_T[43]);
    a = MD5_HH(a, b, c, d, M[9], 4, MD5_T[44]);
    d = MD5_HH(d, a, b, c, M[12], 11, MD5_T[45]);
    c = MD5_HH(c, d, a, b, M[15], 16, MD5_T[46]);
    b = MD5_HH(b, c, d, a, M[2], 23, MD5_T[47]);
    // Round 4
    a = MD5_II(a, b, c, d, M[0], 6, MD5_T[48]);
    d = MD5_II(d, a, b, c, M[7], 10, MD5_T[49]);
    c = MD5_II(c, d, a, b, M[14], 15, MD5_T[50]);
    b = MD5_II(b, c, d, a, M[5], 21, MD5_T[51]);
    a = MD5_II(a, b, c, d, M[12], 6, MD5_T[52]);
    d = MD5_II(d, a, b, c, M[3], 10, MD5_T[53]);
    c = MD5_II(c, d, a, b, M[10], 15, MD5_T[54]);
    b = MD5_II(b, c, d, a, M[1], 21, MD5_T[55]);
    a = MD5_II(a, b, c, d, M[8], 6, MD5_T[56]);
    d = MD5_II(d, a, b, c, M[15], 10, MD5_T[57]);
    c = MD5_II(c, d, a, b, M[6], 15, MD5_T[58]);
    b = MD5_II(b, c, d, a, M[13], 21, MD5_T[59]);
    a = MD5_II(a, b, c, d, M[4], 6, MD5_T[60]);
    d = MD5_II(d, a, b, c, M[11], 10, MD5_T[61]);
    c = MD5_II(c, d, a, b, M[2], 15, MD5_T[62]);
    b = MD5_II(b, c, d, a, M[9], 21, MD5_T[63]);
    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const out = new DataView(new ArrayBuffer(16));
  out.setInt32(0, a0, true);
  out.setInt32(4, b0, true);
  out.setInt32(8, c0, true);
  out.setInt32(12, d0, true);
  let hex = "";
  for (const byte of new Uint8Array(out.buffer)) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

export const getGravatarUrl = (
  email: string,
  size: number = 200,
  defaultImage: string = "mp",
): string => {
  const trimmedEmail = email.trim().toLowerCase();
  const hash = md5Hex(trimmedEmail);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};
