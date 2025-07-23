import crypto from 'crypto'

// ---------------------------------------
// CHARACTER SET FOR BASE62 ENCODING
// ---------------------------------------
// Base62 uses:
//  - 10 digits:       0–9
//  - 26 lowercase:    a–z
//  - 26 uppercase:    A–Z
// Total = 62 characters
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

// ---------------------------------------
// ENCODE A NUMBER (e.g. timestamp) TO BASE62
// ---------------------------------------
function encodeBase62Number(n) {
  let result = ''
  let num = BigInt(n)

  // Convert decimal number to Base62 string
  while (num > 0) {
    result = BASE62[num % 62n] + result
    num /= 62n
  }

  // Return '0' if input was 0
  return result || '0'
}

// ---------------------------------------
// ENCODE A BINARY BUFFER (e.g. hash) TO BASE62
// ---------------------------------------
function encodeBase62Buffer(buffer) {
  // Convert buffer (binary data) to a BigInt via hex
  let num = BigInt('0x' + buffer.toString('hex'))

  let result = ''
  // Convert BigInt to Base62 string
  while (num > 0) {
    result = BASE62[num % 62n] + result
    num /= 62n
  }

  return result
}

// ---------------------------------------
// MAIN: Generate Safe, Compact Slug
// ---------------------------------------

/**
 * Generates a short, collision-resistant slug using:
 * - Random UUID (v4)
 * - SHA-256 hash
 * - Base62 encoding
 * - Encoded timestamp for uniqueness
 *
 * @param {number} length - Total slug length (default: 10)
 * @returns {string} Compact, URL-safe slug
 */
export function generateSafeSlug(length = 10) {
  // ----------------------------
  // STEP 1: Generate randomness
  // ----------------------------
  const uuid = crypto.randomUUID() // v4 UUID = good source of randomness
  const hash = crypto.createHash('sha256').update(uuid).digest()

  // ----------------------------
  // STEP 2: Encode random hash to Base62
  // ----------------------------
  // Slice to leave room for timestamp (e.g., 4 chars reserved for TS)
  const randomLength = Math.max(4, length - 4)
  const hashPart = encodeBase62Buffer(hash).slice(0, randomLength)

  // ----------------------------
  // STEP 3: Add timestamp entropy
  // ----------------------------
  // Use Date.now() (in ms), modulo 62^4 to constrain length to 4 Base62 chars
  const ts = Date.now() % (62 ** 4) // ≈ 14.7 years before rollover
  const tsPart = encodeBase62Number(ts).padStart(4, '0') // always 4 chars

  // ----------------------------
  // STEP 4: Combine and return
  // ----------------------------
  return hashPart + tsPart
}

console.log(generateSafeSlug()) // Example usage
console.log(generateSafeSlug()) // Example usage
console.log(generateSafeSlug()) // Example usage