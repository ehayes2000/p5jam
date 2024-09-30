import { Context } from 'elysia'

export const authorizeUser = (userId: string) => async (ctx: Context) => ({
  isAuth: true,
  userId,
})

export const unauthorizeUser = (userId: string) => async (ctx: Context) => ({
  isAuth: false,
  userId,
})
