import Image from 'next/image';
import React from 'react';

type Props = {
  iconsrc: string;
  iconAlt: string;
  type: string;
  value?: string;
  className?: string;
  placeholder?: string;
  onChangedHandler: (value: string) => void;
  //string 매개변수, 반환값은 void (함수가 값을 반환하지 않고 side-effects만 수행한다는 의미)
  onBlurHandler?: () => void;
};

const InputContainer = (props: Props) => {
  const {
    iconsrc,
    iconAlt,
    type,
    value,
    className,
    placeholder,
    onChangedHandler,
    onBlurHandler,
  } = props;
  return (
    <div className='auth__input-container w-full'>
      <Image width={25} height={25} src={iconsrc} alt={iconAlt} />
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={`auth__input ${className}`}
        //이벤트가 발생하는 타겟은 HTML요소, 즉 input을 참조한다는 뜻 input은 HTMLInputElement타입
        //입력필드에 값이 입력되면 onChangeHandler(외부에서 전달받은)함수를 호출, 인자로 e.target.value를 전달함.
        onChange={(e: { target: HTMLInputElement }) =>
          onChangedHandler(e.target?.value)
        }
        //사용자가 입력필드에서 포커스를 잃었을때 호출되는 함수
        onBlur={onBlurHandler}
      />
    </div>
  );
};

export default InputContainer;
