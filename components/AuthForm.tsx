import React, { FormEvent, useState } from 'react';
import InputContainer from './InputContainer';
import emailIcon from '@/public/email_envelope_mail_send_icon.svg';
import lockIcon from '@/public/lock_locker_icon.svg';
import { RegisterResponse, User } from '@/models/customType';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

//서버에 회원가입 요청 보내는 비동기함수
async function registerUser(userData: User) {
  const response = await fetch('api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  //자바스크립트 HTTP 응답객체 response의 속성인 ok
  //response.ok = HTTP응답이 성공적임.
  //data.message = 일반적으로 서버의 HTTP응답 본문에 포함된 객체 데이터의 message 속성 참조
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
}

const AuthForm = () => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();

  //login과 signup 전환함수 setisLogin을 이전과 반대 boolean값으로 바꿔줌으로써 토글
  const authModeHandler = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setEnteredEmail('');
    setEnteredPassword('');
    setEnteredConfirmPassword('');
  };

  //form에서 submit이 발생했을때 호출되는 비동기함수
  const SubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData: User = { enteredEmail, enteredPassword };

    //제출된 form 유효성 검사 (email이나 password 둘중 하나라도 비어있으면 error)
    if (
      enteredEmail?.trim().length === 0 ||
      enteredPassword?.trim().length === 0
    ) {
      toast.error('Please enter the information');
      return;
    }

    //로그인이 아니면 User password 확인
    if (!isLogin) {
      if (enteredPassword !== enteredConfirmPassword) {
        toast.error('Password is incorrect');
        return;
      }
      //비밀번호가 일치하면 registerUser 함수로 사용자데이터를 이용해 회원가입
      try {
        //회원가입 처리
        const response: RegisterResponse = await registerUser(userData);
        toast.success(
          'Registeration was successful! You can login with your info!'
        );
        //가입처리가 되면 setIsLogin 상태를 true로 == 로그인모드로 전환
        setIsLogin(true);
        //가입과정에서 오류 발생시 오류메세지 표시
      } catch (error) {
        //에러 타입주기
        let msg = (error as Error).message;
        toast.error(msg);
      }
      //로그인상태이면(!isLogin == false) signIn함수(next-auth)를 이용해 이메일과 비밀번호로 로그인시도
    } else {
      const result = await signIn('credentials', {
        redirect: false,
        enteredEmail,
        enteredPassword,
      });
      //singIn함수에 결과 result객체에 error속성이 없다면 페이지를 redirect하여 weather로 라우팅
      if (!result?.error) {
        router.replace('/weather');
      }
      if (result?.error) {
        let msg = result?.error;
        toast.error(msg);
      }
    }
  };

  return (
    <form className='auth__form' onSubmit={SubmitHandler}>
      <InputContainer
        type='email'
        value={enteredEmail}
        onChangeHandler={setEnteredEmail}
        placeholder='Please enter your email'
        iconsrc={emailIcon}
        iconAlt='email icon'
      />
      <InputContainer
        type='password'
        placeholder='Please enter your password'
        value={enteredPassword}
        onChangeHandler={setEnteredPassword}
        iconsrc={lockIcon}
        iconAlt='lock icon'
      />
      {!isLogin && (
        <InputContainer
          type='password'
          value={enteredConfirmPassword}
          onChangeHandler={setEnteredConfirmPassword}
          placeholder='Confirm Password'
          iconsrc={lockIcon}
          iconAlt='lock icon'
        />
      )}
      <button className='auth__btn'>
        {isLogin ? 'Login' : 'Create Account'}
      </button>
      <div className='auth__mode'>
        {isLogin ? 'Dont you have an account?' : 'Login with existing account'}
        <button
          className='ml-2 text-primary'
          type='button'
          onClick={authModeHandler}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
