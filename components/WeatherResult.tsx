import React from 'react';
import { WeatherData } from '@/models/customType';
import weatherImage from '@/public/weather.svg';
import Image from 'next/image';
import { customLoader } from '@/lib/weather-services';

type WeatherProps = {
  weatherData?: WeatherData;
};

//weatherData 입력받아 날씨정보 표시
const WeatherResult = ({ weatherData }: WeatherProps) => {
  const temp = weatherData?.main.temp.toFixed();
  const city = weatherData?.name;
  const country = weatherData?.sys.country;
  const imgSrc = weatherData?.weather[0].icon || weatherImage;

  return (
    <div className='mt-4 space-y-1'>
      <h2 className='text-2xl font-semibold text-primary'>{`${city}, ${country}`}</h2>
      <Image
        src={imgSrc}
        loader={customLoader}
        alt='weather image'
        className='mx-auto'
        width={150}
        height={150}
      />
      <p className='weather__temp'>{`${temp}°`}</p>
      <p>{weatherData?.weather[0].main}</p>
    </div>
  );
};

export default WeatherResult;
