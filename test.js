import { generateObscuredSlug } from './slug.js'

// ---------------------------------------
// CONFIGURATION
// ---------------------------------------
// Number of slugs to generate for the test
const ITERATIONS = 1000

// Desired length of each slug
const LENGTH = 10

// Track all generated slugs to check for duplicates
const slugs = new Set()

// Track whether any test condition fails
let failed = false

console.log(`Running test with ${ITERATIONS} slugs of length ${LENGTH}...\n`)

// ---------------------------------------
// MAIN TEST LOOP
// ---------------------------------------
for (let i = 0; i < ITERATIONS; i++) {
  const slug = generateObscuredSlug(LENGTH)

  // ✅ Check 1: Ensure the slug has the correct length
  if (slug.length !== LENGTH) {
    console.error(`❌ Slug has incorrect length: "${slug}"`)
    failed = true
  }

  // ✅ Check 2: Ensure slug hasn't already been seen (i.e., is unique)
  if (slugs.has(slug)) {
    console.error(`❌ Duplicate slug found: "${slug}"`)
    failed = true
  }

  // Record this slug for future uniqueness checks
  slugs.add(slug)
}

// ---------------------------------------
// OUTPUT SAMPLE + TEST RESULT
// ---------------------------------------

// Print a sample of the slugs for human inspection
console.log(`✅ Sample slugs:`)
Array.from(slugs).slice(0, 10).forEach((slug) => {
  console.log(`  ${slug}`)
})

// Final result summary
if (!failed) {
  console.log(`\n✅ All ${ITERATIONS} slugs are unique and valid.`)
  process.exit(0)
} else {
  console.error(`\n❌ Test failed.`)
  process.exit(1)
}