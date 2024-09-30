import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import client from './prisma'

const userData: Prisma.UserCreateInput[] = [
  {
    id: 'testUserOwner',
    name: 'testUserOwner',
  },
  {
    id: 'testUserParticipant',
    name: 'testUserParticipant',
  },
]

async function main() {
  for (const u of userData) {
    await client.user.create({
      data: u,
    })
  }
}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
