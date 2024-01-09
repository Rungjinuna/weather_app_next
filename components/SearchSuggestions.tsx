//사용자가 검색필드에 입력한 텍스트에 기반하여 도시 제안을 표시하는 컴포넌트
import { LoadedCities } from '@/models/customType';

type Props = {
  onCityClickHandler: (value: string) => void;
  cityOptions: LoadedCities[];
};
const SearchSuggestions = ({ cityOptions, onCityClickHandler }: Props) => {
  return (
    <div className='px-2 py-2 absolute w-full text-slate-300 bg-[#2e2968] shadow-md min-h-fit'>
      <ul>
        {cityOptions.map((city, index) => {
          return (
            <li
              className='p-1 cursor-pointer  transition-all duration-300 hover:text-[#56aad8]'
              key={index}
              //사용자가 도시클릭하면 onCityClickHandler함수실행
              //클릭된 도시의 정보가 부모컴포넌트 (Search Bar)로 전달된다.
              onClick={() =>
                onCityClickHandler(`${city.name}, ${city.country}`)
              }
            >{`${city.name}, ${city.country}`}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
