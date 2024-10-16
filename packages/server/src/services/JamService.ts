// import jamPrimatives from './primitives/jams'
import type { TJam } from './primitives/types';
import { create, get, update } from './primitives/jams';
import { addMilliseconds } from 'date-fns';

export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLen = 5;
  // hehexd
  let code = '';
  for (let i = 0; i < codeLen; ++i) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default class JamService {
  constructor() {}

  async get(id: string): Promise<TJam | undefined> {
    console.log('GET', id, await get({ id: id.toUpperCase() }));

    return (await get({ id: id.toUpperCase() }))[0];
  }

  async list(params: { userId?: string }): Promise<{
    owner: TJam[];
    participant: TJam[];
  }> {
    const owned = await get({ ownerId: params.userId });
    const overlap = new Set<string>();
    owned.forEach((j) => overlap.add(j.id));
    const participated = await get({ participantId: params.userId });
    return {
      owner: owned,
      participant: participated.filter((j) => !overlap.has(j.id)),
    };
  }

  async create(params: {
    title: string;
    durationMs: number;
    userId: string;
  }): Promise<TJam> {
    const { durationMs, title, userId } = params;
    // check if user is already in an active Jam
    const endTime = addMilliseconds(new Date(), durationMs);
    return await create({
      id: generateInviteCode(),
      startTime: new Date(),
      ownerId: userId,
      isDeleted: false,
      title,
      endTime,
    });
  }

  async end(params: { id: string; owerId: string }) {
    // TODO
  }
}
