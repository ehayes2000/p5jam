import { api } from '../src/server'
import { describe, test, expect } from 'bun:test'

test('env', () => expect(process.env.NODE_ENV).toBe('test'))
