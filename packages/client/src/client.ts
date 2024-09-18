import { treaty } from '@elysiajs/eden'
import type { App } from 'server'

export const client = treaty<App>('', {
  fetcher(url, options) {
    const [_, path] = url.toString().split('//')
    return fetch(`${import.meta.env.VITE_API_BASE}/${path}`, options)
  },
})
