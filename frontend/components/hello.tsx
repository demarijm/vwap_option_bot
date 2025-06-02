'use client'

import { api } from '@/lib/trpc'

export function Hello() {
  const { data, isLoading } = api.example.hello.useQuery({})

  if (isLoading) return <p>Loading...</p>
  return <p>{data?.greeting}</p>
}
