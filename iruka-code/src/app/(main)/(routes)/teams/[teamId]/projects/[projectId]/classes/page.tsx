'use client';

import { useUser } from '@clerk/clerk-react';
import { redirect, useParams } from 'next/navigation';

const ClassPage = () => {
  const { user } = useUser();
  const params = useParams();

  if (!user) return redirect('/');

  const name = user.firstName ? user.firstName : user.username;

  return <div>クラス一覧ページ</div>;
};

export default ClassPage;
