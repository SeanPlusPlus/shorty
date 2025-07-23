import { generateObscuredSlug } from './slug.js'

const ITERATIONS = 1000
const LENGTH = 10

const slugs = new Set()
let failed = false

console.log(`Running test with ${ITERATIONS} slugs of length ${LENGTH}...\n`)

for (let i = 0; i < ITERATIONS; i++) {
  const slug = generateObscuredSlug(LENGTH)

  // Check length
  if (slug.length !== LENGTH) {
    console.error(`❌ Slug has incorrect length: "${slug}"`)
    failed = true
  }

  // Check uniqueness
  if (slugs.has(slug)) {
    console.error(`❌ Duplicate slug found: "${slug}"`)
    failed = true
  }

  slugs.add(slug)
}

// Display first few examples
console.log(`✅ Sample slugs:`)
Array.from(slugs).slice(0, 10).forEach((slug) => {
  console.log(`  ${slug}`)
})

if (!failed) {
  console.log(`\n✅ All ${ITERATIONS} slugs are unique and valid.`)
  process.exit(0)
} else {
  console.error(`\n❌ Test failed.`)
  process.exit(1)
}