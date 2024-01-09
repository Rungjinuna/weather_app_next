import Layout from '@/components/Layout';
import Loading from '@/components/Loading/Loading';
import SearchBar from '@/components/SearchBar';
import WeatherResult from '@/components/WeatherResult';
import { API_KEY, BASE_URL, fetchData } from '@/lib/weather-services';
import { WeatherData } from '@/models/customType';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Weather: NextPage = () => {
  const [tempIsLow, setTempIsLow] = useState(false);
  const [city, setCity] = useState('Seoul');
  const [isLoading, setIsLoading] = useState(true);
  //현재 날씨 데이터를 저장하는상태. WeatherData 타입이나 null타입을 가질수있음.
  //초기값이 null타입으로 날씨데이터가 로드되기전까지는 아무것도 표시하지않음.
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const router = useRouter();

  //도시가 변경될때마다 날씨 데이터 가져오고 UI업데이트
  useEffect(() => {
    const getWeatherData = async () => {
      //city문자열이 비어있지 않은 경우 setIsLoading 상태를 true로 변경하여 UI 반영
      if (city.trim().length > 0) {
        setIsLoading(true);
        //날씨 데이터 가져오기 (weather-services.ts)
        try {
          //fetchData함수는 범용 데이터가져오기함수, 변수로 url전달
          const weather: WeatherData = await fetchData(
            `${BASE_URL}weather?q=${city}&limit=6&appid=${API_KEY}&units=metric`
          );

          setCurrentWeather(weather);
        } catch (error) {
          //instanceof 는 자바스크립트에서 오류객체가 Error타입인지 확인
          if (error instanceof Error) {
            toast.error(error.message || 'Something went wrong!');
          }
        }
        //데이터로딩이 끝나면 성공이든 실패든 로딩상태를 false로 바꿔서 로딩인디케이터를 숨긴다.
        setIsLoading(false);
      }
    };
    //작성한 함수 호출
    getWeatherData();
    //의존성배열 city가 변경될때마다 함수호출
  }, [city]);

  //날씨상태에따라 background이미지 업데이트
  useEffect(() => {
    //currentWeather이 존재하면(데이터가로드되면) 현재온도를 숫자로, 소숫점없이반올림함
    if (currentWeather) {
      const temp = +currentWeather?.main.temp.toFixed();
      if (temp < 3) {
        setTempIsLow(true);
      } else {
        setTempIsLow(false);
      }
    }
  }, [currentWeather]);

  //사용자 로그아웃 처리 함수
  //signOut (next-auth 제공함수) 함수는 사용자의 세션을 종료하고 로그아웃 처리
  //signOut은 Promise 반환, 로그아웃과정 비동기적으로 처리
  //로그아웃이 성공적으로 처리되면 then 이하 실행.
  //res.url로 지정된 경로로 리다이렉트
  const logoutHandler = () => {
    const data = signOut({ redirect: false, callbackUrl: '/' });
    data.then((res) => {
      router.push(res.url);
    });
  };

  //temp 상태에따라 카드배경 css 변경
  const cardBg = tempIsLow ? 'bg-tempLow' : 'bg-tempHigh';
  //날씨데이터에따라 UI변경하기
  //초기상태에서는 로딩컴포넌트 렌더링
  let weatherResultContent = <Loading />;
  //로딩되었는데 currentWeather 날씨데이터가 없을때
  if (!isLoading && !currentWeather) {
    weatherResultContent = <p className='py-5'>Nothing Found!</p>;
  }
  //로딩되고 날씨데이터가있을때 weatherResult 보여줌
  if (!isLoading && currentWeather) {
    weatherResultContent = <WeatherResult weatherData={currentWeather} />;
  }

  return (
    <Layout
      title='Weather App'
      className={`w-3/4 ${cardBg} bg-cover bg-card bg-blend-overlay lg:w-1/4`}
    >
      <div className='weather'>
        <SearchBar onCityChange={setCity} />
        {weatherResultContent}
        <button className='btn btn__secondary' onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </Layout>
  );
};

//서버사이드렌더링
//페이지가 브라우저에의해 요청될 때마다 서버에서 실행됨 (페이지를 렌더링하기전에 필요한 데이터 미리가져옴)
//context 매개변수를 통해 현재 페이지의 context에 접근할 수 있음
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/unauthenticated',
        permanent: false, //다이렉트가 영구적이지 않음
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

export default Weather;
