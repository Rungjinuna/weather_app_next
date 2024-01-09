const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct?';

// api에서 로딩이미지 받아오기
type Props = {
  src: string;
};
const customLoader = ({ src }: Props) => {
  return `http://openweathermap.org/img/wn/${src}@2x.png`;
};

// api에서 데이터 받아오기
//범용 데이터 가져오기 함수로 Url을 매개변수로 받아 해당 Url에서 데이터를 가져온다.
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data`);
  }

  const data = await response.json();
  return data as T;
}

export { API_KEY, BASE_URL, GEO_API_URL, customLoader, fetchData };
