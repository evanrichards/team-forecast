"use client";

import { trpc } from "@/app/_trpc/client";

export default function page() {
  const data = trpc.getUserCount.useQuery();
  const dataSet = trpc.setData.useMutation();

  return (
    <main>
      <div
        onClick={() => {
          dataSet.mutateAsync("hello");
        }}
      >
        {data.data}
      </div>
      <div>{dataSet.data}</div>
    </main>
  );
}
