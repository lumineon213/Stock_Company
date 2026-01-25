"use client";
import { useParams } from 'next/navigation';
import HistoryDetail from '@/pages/history/historyDetail';
import ProtectedRoute from '@/components/commons/ProtectedRoute';

export default function Page() {
  const params = useParams();
  const gameId = params?.id as string;

  return (
    <ProtectedRoute>
      <HistoryDetail gameId={gameId} />
    </ProtectedRoute>
  );
}
