import { $ } from 'bun'

async function setupTestDbAndRunTests() {
  try {
    // Remove existing test.db if it exists and create a new one
    await $`rm -f prisma/test.db && touch prisma/test.db`
    console.log('Created new test.db')

    // Run Prisma migrations
    await $`bunx dotenv -e .env.test -- bunx prisma migrate dev`
    console.log('Ran Prisma migrations')

    // Seed the database
    await $`bun prisma/seed.ts`
    console.log('Seeded the database')
  } catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  }
}

await setupTestDbAndRunTests()
