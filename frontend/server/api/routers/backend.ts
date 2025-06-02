import { router, publicProcedure } from '../trpc'

export const backendRouter = router({
  status: publicProcedure.query(async () => {
    const res = await fetch('http://127.0.0.1:8080/api/status')
    if (!res.ok) {
      throw new Error('Failed to fetch status from backend')
    }
    return (await res.json()) as { trading: boolean }
  }),
})
