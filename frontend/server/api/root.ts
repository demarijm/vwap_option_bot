import { router } from './trpc'
import { exampleRouter } from './routers/example'
import { backendRouter } from './routers/backend'

export const appRouter = router({
  example: exampleRouter,
  backend: backendRouter,
})

export type AppRouter = typeof appRouter
