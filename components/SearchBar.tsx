import React, { useEffect, useState } from 'react';
import InputContainer from './InputContainer';
import searchIcon from '@/public/search_magnifier_mobile ui_zoom_icon.svg';
import { Cities, LoadedCities } from '@/models/customType';
import LoadingSpinner from './Loading/LoadingSpinner';
import SearchSuggestions from './SearchSuggestions';
import { debounce } from 'lodash';
import { API_KEY, GEO_API_URL, fetchData } from '@/lib/weather-services';
import { toast } from 'react-toastify';

type Props = {
  onCityChange: (value: string) => void;
};

const SearchBar = ({ onCityChange }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<LoadedCities[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //debouncedGetCitySuggestions함수 정의 (1초 지연시간 가지는 함수)
    //Lodash에서 제공하는 debounce 함수 (빠른 연속호출을 방지, 일정시간 지연후 함수실행)
    const debouncedGetCitySuggestions = debounce(async () => {
      //사용자가 최소 3글자 이상 입력했을때만 API 요청을 보내도록함
      if (searchValue.length > 2) {
        //API요청 전에 setIsLoading을 호출하여 로딩상태 활성화
        setIsLoading(true);
        try {
          //fetcData 범용 데이터불러오기함수 사용해서 API 요청
          const cities: Cities[] = await fetchData(
            `${GEO_API_URL}q=${searchValue}&limit=6&appid=${API_KEY}`
          );
          //데이터 변환 API로부터 받은 cities 배열을 순회
          //각도시의 country와 name정보만을 포함하는 새로운 객체 배열 loadedCities 생성
          const LoadedCities = cities.map((city) => {
            return {
              country: `${city.country}`,
              name: `${city.name}`,
            };
          });
          //setCitySuggestions를 호출하여 도시제안목록 업데이트
          setCitySuggestions([...LoadedCities]);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message || 'Something went Wrong!');
          }
        }
        //setIsLoading 상태를 호출하여 로딩상태 비 활성화
        setIsLoading(false);
      } else {
        //에러가 아닐 때 도시 제안목록 비우기
        setCitySuggestions([]);
      }
    }, 1000);
    debouncedGetCitySuggestions();
  }, [searchValue]);

  //사용자가 도시제안목록을 클릭했을때 호출되는 함수
  //도시제안목록 초기화
  //검색필드값초기화(setSearchValue)
  //선택된 도시의 값을 부모컴포넌트로 전달. val(사용자가 클릭한 도시의 이름 또는 값)
  //val는 부모컴포넌트에서 도시변경이벤트를 처리하는데사용됨.
  const handleSuggestionOnClick = (val: string) => {
    setCitySuggestions([]);
    setSearchValue('');
    onCityChange(val);
  };

  return (
    <div className='w-full'>
      <div className='flex gap-1'>
        <InputContainer
          className='capitalize'
          type='text'
          placeholder='Enter a city name'
          iconAlt='search icon'
          iconsrc={searchIcon}
          value={searchValue} //searchValue 상태변수가 변경될때마다 영향받음
          onChangedHandler={setSearchValue} //사용자가 입력할때마다 setSearchValue함수호출
          onBlurHandler={() => {
            //포커스잃었을때 2초후에 도시제안목록비우기
            setTimeout(() => {
              setCitySuggestions([]);
            }, 200);
          }}
        />
        {/* isLoading이 참일경우에만 표시되는 LoadingSpinner */}
        {isLoading && <LoadingSpinner />}
      </div>
      {/* citySuggestion 배열의 길이가 0보다 클때만 SearchSuggestion표시 */}
      {citySuggestions.length > 0 && (
        <SearchSuggestions
          onCityClickHandler={handleSuggestionOnClick}
          cityOptions={citySuggestions}
        />
      )}
    </div>
  );
};

export default SearchBar;
