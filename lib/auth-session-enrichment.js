import { getUserProfileByUid, updateUserProfileLastLogin } from './user-profile-store.js'

export async function enrichSessionUser(baseUser) {
  if (!baseUser?.uid) {
    return baseUser
  }

  const profile = await getUserProfileByUid(baseUser.uid)
  const enriched = {
    ...baseUser,
    role: profile?.role || baseUser.role || 'employer',
    company: profile?.company || baseUser.company || '',
    workspaceId: profile?.workspaceId || baseUser.workspaceId || '',
    name: profile?.name || baseUser.name,
  }

  await updateUserProfileLastLogin(baseUser.uid)

  return enriched
}
