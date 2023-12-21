import AuthForm from '@/components/AuthForm';
import Layout from '@/components/Layout';
import WelcomeContent from '@/components/WelcomeContent';
import React from 'react';

export default function Home() {
  return (
    <>
      <Layout title='weather App login page' className='w-3/4 lg:w=1/2'>
        <WelcomeContent />
        <AuthForm />
      </Layout>
    </>
  );
}
