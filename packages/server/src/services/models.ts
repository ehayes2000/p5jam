// import dbClient from '../prisma'

// export default class Models {
//   private client: typeof dbClient
//   constructor(client: typeof dbClient) {
//     this.client = client
//   }

//   async createJam(params: {
//     title: string
//     durationMs: number
//     userId: string
//   }) {
//     const { title, durationMs, userId } = params
//     const activeJamId = await this.getUserActiveJam({ userId })
//     if (activeJamId)
//       throw new Error('Cannot participate in / own multiple jams')
//     const inviteCode = await generateInviteCode()
//     const startTime = new Date()
//     const endTime = addMilliseconds(startTime, durationMs)
//     const [comeOnandSlam, _andWelcomeToTheJam] = await this.client.$transaction(
//       [
//         this.client.jam.create({
//           data: {
//             id: inviteCode,
//             ownerId: userId,
//             startTime: startTime,
//             endTime: endTime,
//             title,
//           },
//         }),
//         this.client.jamParticipant.create({
//           data: {
//             jamId: inviteCode,
//             userId,
//           },
//         }),
//       ],
//     )
//     return { id: comeOnandSlam.id }
//   }

//   async deleteJam(params: { id: string; userId: string }) {
//     const { id, userId } = params
//     await this.client.jam.update({
//       where: {
//         id,
//         ownerId: userId,
//         endTime: {
//           lte: new Date(),
//         },
//       },
//       data: {
//         isDeleted: true,
//       },
//     })
//     return
//   }

//   async joinJam(params: { userId: string; id: string }) {
//     const { userId, id } = params
//     const { jamId } = await this.client.jamParticipant.upsert({
//       where: {
//         jamId_userId: {
//           userId,
//           jamId: id,
//         },
//       },
//       create: {
//         jamId: id,
//         userId,
//       },
//       update: {
//         active: true,
//       },
//     })
//     return { id: jamId }
//   }

//   async leaveJam(params: { userId: string; id: string }) {
//     const { id, userId } = params
//     await this.client.jamParticipant.update({
//       where: {
//         jam: {
//           ownerId: {
//             not: userId,
//           },
//         },
//         jamId_userId: {
//           userId,
//           jamId: id,
//         },
//       },
//       data: {
//         active: false,
//       },
//     })
//   }
// }
