import { auth } from '../src/githubAuth'
import { Elysia } from 'elysia'

export const auth2 = new Elysia({ name: 'Service.Auth' })
  .derive(
    { as: 'scoped' },
    async ({ headers: { cookie }, cookie: { auth_session }, error }) => {
      return { Auth: { userId: 'me' } }
    },
  )
  .macro(({ onBeforeHandle, mapResponse }) => ({
    isSignIn(_: boolean) {
      onBeforeHandle(
        async ({
          Auth,
          error,
        }): Promise<undefined | ReturnType<typeof error>> => {
          return
        },
      )
    },
  }))
  .resolve({ as: 'scoped' }, ({ Auth }) => {
    return {
      userId: Auth.userId ?? '',
    }
  })

export const authorizeUser = (userId: string) =>
  new Elysia({ name: 'Service.Auth' })
    .derive({ as: 'scoped' }, async () => {
      return { Auth: { userId: userId } }
    })
    .macro(({ onBeforeHandle, mapResponse }) => ({
      isSignIn(_: boolean) {
        onBeforeHandle(
          async ({
            Auth,
            error,
          }): Promise<undefined | ReturnType<typeof error>> => {
            return
          },
        )
      },
    }))
    .resolve({ as: 'scoped' }, () => {
      return {
        userId: userId,
      }
    }) as typeof auth

export const unauthorizeUser = (): typeof auth =>
  new Elysia({ name: 'Service.Auth' })
    .derive(
      { as: 'scoped' },
      async ({ headers: { cookie }, cookie: { auth_session }, error }) => {
        return { Auth: { userId: '' } }
      },
    )
    .macro(({ onBeforeHandle, mapResponse }) => ({
      isSignIn(_: boolean) {
        onBeforeHandle(async ({ error }) => {
          return error(401)
        })
      },
    }))
    .resolve({ as: 'scoped' }, ({ Auth }) => {
      return {
        userId: '',
      }
    }) as typeof auth
