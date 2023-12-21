import Head from 'next/head';
import React from 'react';
import Card from './Card';

type Props = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

const Layout = ({ children, title = 'Weather App', className }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content='Nextjs weather app' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='main'>
        <Card className={className}>{children}</Card>
      </main>
    </>
  );
};

export default Layout;
