//사용자의 회원가입 요청 처리
//사용자가 입력한 이메일과 비밀번호를 받아 데이터베이스에 사용자 계정을 생성하는 기능.
//입력된 이메일과 비밀번호의 유효성을 검사하고 mongoDB에 연결해서 존재하는 이메일인지 확인,
//새로운 사용자의 경우, 비밀번호를 해시하여 데이터베이스에 사용자정보를 저장한다.
//사용자 계정이 생성되었다는 응답 반환.
import { hashPassword } from '@/lib/auth-services';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/customType';
import { NextApiRequest, NextApiResponse } from 'next';
//제네릭타입으로 타입지정
//NextApiRequest를 확장함으로써 MyApiRequest<T>는 NextApiRequest 인터페이스의 모든 속성과 메소드 상속
interface MyApiRequest<T> extends NextApiRequest {
  body: T;
}
//비동기함수 호출
const handler = async (req: MyApiRequest<User>, res: NextApiResponse) => {
  //Post메소드이면 req.body에서 데이터추출 -> 구조분해할당으로 enteredEmail과 enteredPassword 속성 추출후 할당
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const { enteredEmail, enteredPassword } = data;
      //이메일과 비밀번호가 유효하지않을때 422상태반환 (입력 유효성 검사)
      if (
        !enteredEmail ||
        !enteredEmail.includes('@') ||
        !enteredPassword ||
        enteredPassword.trim().length < 5
      ) {
        res.status(422).json({
          message: 'Invalid input (password should be at least 5 characters.)',
        });

        return;
      }

      //mongodb 데이터베이스에 연결하기 (connectToDatabase함수 호출,
      //await-> 데이터베이스에 연결완료될때까지 기다림)
      const client = await connectToDatabase();
      //데이터베이스 선택하기 (users라는 이름의 데이터베이스선택)
      const db = client.db('users');
      //이메일존재여부확인(비동기로 확인될때까지 대기)
      //mongodb에서 제공하는 collection과 findOne함수
      //users컬렉션에서 enteredEmail필드가 사용자가 입력한 이메일과 일치하는 문서를 찾는다.
      const emailExisting = await db
        .collection('users')
        .findOne({ enteredEmail });
      //이메일이 이미 존재할 때 상태반환
      if (emailExisting) {
        res.status(409).json({ message: 'user already exist!' });
        return;
      }

      //비밀번호 해싱하기 (auth-service)
      const hashedPassword = await hashPassword(enteredPassword);
      //데이터베이스 컬렉션 선택
      //db에서 사용자 데이터를 저장하기 위한 컬렉션 선택
      const usersCollection = db.collection('users');
      //mongodb insertOne 메소드를 이용해서 사용자 이메일, 해시된 비밀번호 데이터베이스에 저장
      const result = await usersCollection.insertOne({
        enteredEmail,
        hashedPassword,
      });

      console.log(result);
      res.status(201).json({ message: 'user is created!' });
      //데이터베이스 연결종료
      client.close();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
export default handler;
