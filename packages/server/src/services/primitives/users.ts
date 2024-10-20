import client from '../../prisma';

export type TUser = {
  name: string;
  id: string;
};

export async function getUsers(filters: {
  id?: string;
  name?: string;
}): Promise<TUser[]> {
  const { id, name } = filters;
  if (id) {
    const user = await client.user.findFirst({
      where: {
        id,
      },
    });
    return user ? [user] : [];
  } else if (name) {
    const user = await client.user.findFirst({
      where: {
        name,
      },
    });
    return user ? [user] : [];
  }
  return await client.user.findMany();
}
