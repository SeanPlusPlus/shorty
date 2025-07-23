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

/**
 * Encodes a number (BigInt or Number) into a Base62 string
 * 
 * @param {number|bigint} n - The number to encode
 * @returns {string} - Base62-encoded string
 */
function encodeBase62Number(n) {
  let result = ''
  let num = BigInt(n)

  while (num > 0) {
    result = BASE62[num % 62n] + result
    num /= 62n
  }

  return result || '0'
}

/**
 * Encodes a Buffer (e.g. hash) into a Base62 string
 * 
 * @param {Buffer} buffer - Binary buffer to encode
 * @returns {string} - Base62-encoded string
 */
function encodeBase62Buffer(buffer) {
  const num = BigInt('0x' + buffer.toString('hex'))
  let result = ''

  let temp = num
  while (temp > 0) {
    result = BASE62[temp % 62n] + result
    temp /= 62n
  }

  return result
}

/**
 * Generates a highly obfuscated, compact slug with:
 * - SHA-256 hash of a UUID (random base)
 * - Timestamp + 1-byte entropy (to prevent collisions)
 * - XOR mixing (to hide any pattern)
 * - Base62 encoding (compact + URL-safe)
 * 
 * @param {number} length - Desired final slug length (default: 10)
 * @returns {string} - Obscured, collision-resistant slug
 */
export function generateObscuredSlug(length = 10) {
  // ---------------------------------------
  // STEP 1: Generate UUID + hash
  // ---------------------------------------
  // UUID v4 gives high-entropy randomness
  const uuid = crypto.randomUUID()

  // Hash the UUID to further scramble and uniformize entropy
  const hash = crypto.createHash('sha256').update(uuid).digest()

  // ---------------------------------------
  // STEP 2: Get timestamp + 1-byte randomness
  // ---------------------------------------
  // Multiply current time by 256 to make room for 1 random byte
  const randByte = crypto.randomBytes(1)[0]
  const mixedEntropy = BigInt(Date.now()) * 256n + BigInt(randByte)

  // ---------------------------------------
  // STEP 3: Convert mixed entropy to a 6-byte buffer (48 bits)
  // ---------------------------------------
  // Convert BigInt to hex string and extract the last 12 hex chars (6 bytes)
  const entropyHex = mixedEntropy.toString(16).padStart(12, '0').slice(-12)
  const entropyBuffer = Buffer.from(entropyHex, 'hex') // 6-byte buffer

  // ---------------------------------------
  // STEP 4: XOR entropy with first 6 bytes of hash
  // ---------------------------------------
  const obscured = Buffer.alloc(6)
  for (let i = 0; i < 6; i++) {
    obscured[i] = hash[i] ^ entropyBuffer[i]
  }

  // ---------------------------------------
  // STEP 5: Combine XOR’d segment with next 6 bytes of hash
  // ---------------------------------------
  const final = Buffer.concat([obscured, hash.slice(6, 12)]) // total: 12 bytes

  // ---------------------------------------
  // STEP 6: Base62 encode and slice to target length
  // ---------------------------------------
  return encodeBase62Buffer(final).slice(0, length)
}

// ---------------------------------------
// DEMO: Print 10 sample slugs
// ---------------------------------------

console.log('Obscured slugs:')
for (let i = 0; i < 10; i++) {
  console.log(generateObscuredSlug())
}