"use client";
import MyPortfolio from '@/pages/portfolio/myportfolio';
import ProtectedRoute from '@/components/commons/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <MyPortfolio />
    </ProtectedRoute>
  );
}
