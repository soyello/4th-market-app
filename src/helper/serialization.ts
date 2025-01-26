import { AdapterUser } from 'next-auth/adapters';

export function serializedUser(user: AdapterUser) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
  };
}

export function deserializedUser(user: ReturnType<typeof serializedUser>): AdapterUser {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
  };
}
