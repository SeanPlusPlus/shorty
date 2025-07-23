// Import Node.js built-in crypto module — no need to install anything
import crypto from 'crypto'

// Base62 character set: 0–9, a–z, A–Z
// Used for compact, URL-safe encoding
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Converts a binary buffer into a Base62 string.
 * @param {Buffer} buffer - The input buffer (e.g., from a hash).
 * @returns {string} Base62-encoded string.
 */
function base62Encode(buffer) {
  // Convert buffer to a big integer (hex → decimal)
  let num = BigInt('0x' + buffer.toString('hex'))

  let result = ''
  // Repeatedly divide by 62 and prepend the corresponding character
  while (num > 0) {
    result = BASE62[num % 62n] + result
    num /= 62n
  }

  return result
}

/**
 * Generates a short, unique slug using UUID + SHA256 hash + Base62.
 * @param {number} n - Length of the slug to return (default: 6).
 * @returns {string} A short, URL-safe slug of length `n`.
 */
export function generateSlug(n = 6) {
  // Step 1: Generate a UUID (v4-style randomness)
  const uuid = crypto.randomUUID()

  // Step 2: Create a SHA-256 hash of the UUID
  const hash = crypto.createHash('sha256').update(uuid).digest()

  // Step 3: Encode the hash as a Base62 string
  const encoded = base62Encode(hash)

  // Step 4: Return only the first `n` characters (your slug)
  return encoded.slice(0, n)
}

console.log(generateSlug())