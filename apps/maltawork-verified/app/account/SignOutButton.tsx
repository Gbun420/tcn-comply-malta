'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      className="rounded-md border px-3 py-2 text-sm"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
      }}
    >
      Sign out
    </button>
  )
}
