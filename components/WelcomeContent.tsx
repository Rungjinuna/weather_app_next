//Card안에 아이콘과 Welcome!
import Image from 'next/image';
import React from 'react';
import weatherIcon from '@/public/weather-icon.png';

const WelcomeContent = () => {
  return (
    <div className='flex flex-col gap-2 items-center'>
      <Image className='app-logo' src={weatherIcon} alt='weather icon' />
      <h3 className='text-2xl'>Welcome!</h3>
    </div>
  );
};

export default WelcomeContent;
