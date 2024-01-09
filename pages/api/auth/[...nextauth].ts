//사용자가 로그인할 때 자격증명을 검증하는 것
//사용자가 제공한 이메일과 비밀번호를 확인하여 유효한경우 사용자에게 접근 권한을 주는것
//CredentialsProvider를 이용하여 커스텀 로그인 프로레스 설정.
//사용자가 제공한 이메일로 데이터베이스에서 해당 사용자를 찾고, 입력된 비밀번호와 데이터베이스에 저장된 비밀번호 비교
// 비밀번호가 일치하면 사용자의 ID와 이메일을 반환하여 인증과정완료.

import { checkPassword } from '@/lib/auth-services';
import { connectToDatabase } from '@/lib/db';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

type Credentials = {
  enteredEmail: string;
  enteredPassword: string;
};

//인증옵션
const authOptions = {
  providers: [
    //사용자 정의 인증방식 설정
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      //authorize 함수 : 사용자가 제공한 이메일과 비밀번호 검증하는 비동기함수
      async authorize(credentials) {
        //사용자가 제공한 이메일과 비밀번호 추출
        const { enteredEmail, enteredPassword } = credentials as Credentials;
        const client = await connectToDatabase();
        //db는 users 데이터베이스이고 usersCollection은 users 데이터베이스의 콜렉션
        //users는 사용자가 제공한 이메일로 데이터베이스에서 검색
        const db = client.db('users');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({
          enteredEmail: enteredEmail,
        });
        //user 이메일로 대조해봤을때 user 없을경우 오류
        if (!user) {
          throw new Error('User not found');
        }

        //사용자 정보들을 각각 내가 사용할 변수에 할당(추출)
        const userPassword: string = user.hashedPassword;
        const userEmail: string = user.enteredEmail;
        const id: string = user._id.toString();

        //checkPassword 함수로 입력한 비밀번호와 해시된 비밀번호같은지 체크 (boolean값 반환)
        const passwordIsCorrect = await checkPassword({
          enteredPassword,
          userPassword,
        });

        //비밀번호가 일치하지않으면
        if (!passwordIsCorrect) {
          throw new Error('Password doesnt match');
        }
        //데이터베이스 연결종료
        client.close();
        return { id: id, email: userEmail };
      },
    }),
  ],
};

export default NextAuth(authOptions);
