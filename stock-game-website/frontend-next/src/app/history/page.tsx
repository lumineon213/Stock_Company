"use client";
import History from '@/pages/history/history';
import ProtectedRoute from '@/components/commons/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  );
}
