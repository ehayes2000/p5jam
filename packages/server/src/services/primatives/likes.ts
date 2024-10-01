import client from '../../prisma'

async function createLike({
  postId,
  userId,
}: {
  postId: string
  userId: string
}) {
  const like = await client.like.create({
    data: {
      postId,
      userId,
    },
  })
  return like
}

async function deleteLike({
  postId,
  userId,
}: {
  postId: string
  userId: string
}) {
  await client.like.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  })
}

const likePrimatives = {
  createLike,
  deleteLike,
}

export default likePrimatives
