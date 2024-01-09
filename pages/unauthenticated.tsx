//인증되지 않은 사용자를 위한 컴포넌트
import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const unauthenticated = () => {
  return (
    <Layout title='authenticated page' className='justify-center text-center'>
      <h1 className='text-lg'>You should login to view requested page</h1>
      <Link href='/' className='mx-auto btn__secondary'>
        Login
      </Link>
    </Layout>
  );
};

export default unauthenticated;
