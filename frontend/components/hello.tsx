'use client'

import { api } from '@/lib/trpc'

export function Hello() {
  const { data, isLoading } = api.backend.status.useQuery()

  if (isLoading) return <p>Loading...</p>
  return <p>Trading is {data?.trading ? 'active' : 'inactive'}</p>
}
