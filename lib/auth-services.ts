//비밀번호 해싱과 비밀번호 체크(비교)
import { Password } from '@/models/customType';
import { hash } from 'bcrypt';
import { compare } from 'bcrypt';

//hashPassword 함수
//입력된 비밀번호를 해시하여 저장하기 안전한 형태로 변환
//bcrypt hash 함수를 이용해서 비밀번호 해시
export const hashPassword = async (password: string) => {
  const hashedPassword = hash(password, 10);
  return hashedPassword;
};

//checkPassword함수
//입력된 비밀번호가 저장된 해시된 비밀번호와 일치하는지 확인(입력한 비밀번호와 데이터베이스에 저장된 비밀번호)
//bcrypt compare 함수 사용 -> 입력된 평문 pw와 해시된 pw 비교
//boolean 값으로 반환
export const checkPassword = async ({
  enteredPassword,
  userPassword,
}: Password) => {
  const passowrdIsValid = await compare(enteredPassword, userPassword);
  return passowrdIsValid;
};
