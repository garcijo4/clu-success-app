'use client';

import { useStore } from '@/lib/storage';

export default function StorageNotice() {
  const { ready, storageAvailable } = useStore();
  if (!ready || storageAvailable) return null;

  return (
    <div
      role="status"
      className="mb-4 rounded-2xl border-2 border-clu-gold bg-clu-gold/10 p-4 text-sm text-ink"
    >
      <p className="font-semibold">This browser is not saving progress.</p>
      <p className="mt-1 text-body">
        You can keep working for this session, but copy or download anything you write
        before closing this tab.
      </p>
    </div>
  );
}
