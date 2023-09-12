'use client';

import { trpc } from '@/app/_trpc/client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Page() {
  const data = trpc.getUserCount.useQuery();
  const dataSet = trpc.setData.useMutation();
  const session = useSession();
  let content;
  switch (session.status) {
    case 'authenticated':
      content = (
        <div>
          <button
            onClick={async () => {
              await signOut();
            }}
          >
            Sign out
          </button>
          <div>{session.data?.user?.name ?? JSON.stringify(session.data)}</div>
          <div
            onClick={() => {
              dataSet.mutateAsync('hello');
            }}
          >
            {data.data}
          </div>
          <div>{dataSet.data}</div>
        </div>
      );
      break;
    case 'unauthenticated':
      content = (
        <div>
          <button
            onClick={async () => {
              await signIn();
            }}
          >
            Sign in
          </button>
        </div>
      );
      break;
    case 'loading':
      content = (
        <div>
          <div>Loading...</div>
        </div>
      );
      break;
    default:
      throw new Error('unreachable');
  }

  return <main>{content}</main>;
}
