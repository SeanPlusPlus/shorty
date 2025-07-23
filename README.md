# Slug Generator

A high-entropy, compact, and obfuscated slug generator written in Node.js.

This utility uses a combination of:

* UUID v4 for randomness
* SHA-256 hashing for uniform entropy
* Timestamp + 1-byte entropy for collision resistance
* XOR mixing to obscure patterns
* Base62 encoding for short, URL-safe output

## Features

* ✅ Collision-resistant (no DB lookup required)
* ✅ URL-safe slugs (Base62)
* ✅ Compact (default 10 characters)
* ✅ Fast and deterministic (in-process)
* ✅ Obscured output (no visible timestamp patterns)

## Usage

### 1. Clone and install

```bash
git clone git@github.com:SeanPlusPlus/shorty.git
cd shorty
npm install
```

### 2. Run it

```bash
npm start
```

### 3. Sample output

```
Obscured slugs:
qZ8XrPLa9k
Yb5VgKxq7B
TfGwM0ZhLd
...
```

## Function Signature

```js
export function generateObscuredSlug(length = 10): string
```

* `length`: Desired slug length (defaults to 10). Safe range: 8–16 characters.
* Returns a **compact**, **obfuscated**, **unique** Base62 string.

## How it Works

1. A UUID v4 is generated.
2. The UUID is hashed with SHA-256.
3. A high-entropy timestamp value is computed: `Date.now() * 256 + randByte`
4. The timestamp is converted to a 6-byte buffer.
5. The timestamp buffer is XOR'd with the first 6 bytes of the hash.
6. 6 more hash bytes are appended to increase entropy.
7. The result is Base62 encoded and sliced to the requested length.

## Why XOR the timestamp?

To avoid recognizable patterns like `dhlk`, which leak creation time across slugs. XOR mixing ensures these patterns are hidden and output remains uniformly random.

## License

MIT. Built with care by SeanPlusPlus.
