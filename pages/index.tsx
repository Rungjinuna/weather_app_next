import AuthForm from '@/components/AuthForm';
import Layout from '@/components/Layout';
import { useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import WelcomeContent from '@/components/WelcomeContent';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/weather');
      } else {
        console.log('No session');
      }
    });
  }, [router]);

  return (
    <>
      <Layout title='weather App login page' className='w-3/4 lg:w-1/2'>
        <WelcomeContent />
        <AuthForm />
      </Layout>
    </>
  );
}
