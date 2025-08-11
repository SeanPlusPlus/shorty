import crypto from 'crypto'

// ---------------------------------------
// CHARACTER SET FOR BASE62 ENCODING
// ---------------------------------------
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Encodes a Buffer (e.g. hash) into a Base62 string
 */
export function encodeBase62Buffer(buffer) {
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
  // STEP 1: Generate UUID (v4)
  // ---------------------------------------
  const uuid = crypto.randomUUID()

  // ---------------------------------------
  // STEP 2: Hash UUID using SHA-256
  // ---------------------------------------
  const hash = crypto.createHash('sha256').update(uuid).digest()

  // ---------------------------------------
  // STEP 3: Create high-entropy timestamp
  // Mixed entropy = (timestamp in ms * 256) + random byte
  // ---------------------------------------
  const randByte = crypto.randomBytes(1)[0]
  const mixedEntropy = BigInt(Date.now()) * 256n + BigInt(randByte)

  // ---------------------------------------
  // STEP 4: Convert mixed entropy to a 6-byte buffer
  // ---------------------------------------
  const entropyHex = mixedEntropy.toString(16).padStart(12, '0').slice(-12)
  const entropyBuffer = Buffer.from(entropyHex, 'hex') // 6 bytes

  // ---------------------------------------
  // STEP 5: XOR entropy buffer with first 6 bytes of hash
  // ---------------------------------------
  const obscured = Buffer.alloc(6)
  for (let i = 0; i < 6; i++) {
    obscured[i] = hash[i] ^ entropyBuffer[i]
  }

  // ---------------------------------------
  // STEP 6: Append 6 more bytes from hash to increase entropy
  // ---------------------------------------
  const extraHashBytes = hash.slice(6, 12)

  // ---------------------------------------
  // STEP 7: Base62 encode final buffer and truncate
  // ---------------------------------------
  const final = Buffer.concat([obscured, extraHashBytes])
  return encodeBase62Buffer(final).slice(0, length)
}

// ---------------------------------------
// DEMO: Print 10 sample slugs
// ---------------------------------------

console.log('Obscured slugs:')
for (let i = 0; i < 10; i++) {
  console.log(generateObscuredSlug())
}