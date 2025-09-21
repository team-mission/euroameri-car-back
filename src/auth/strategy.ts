import passport from 'passport';
import { Strategy } from 'passport-local';

import { getAdminDataByUid } from '@database/controllers/admin';

const LocalStrategy = () => {
  passport.use(
    new Strategy(
      {
        usernameField: 'uid',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          // 아이디 조회 (username을 uid로 사용)
          const admin = await getAdminDataByUid(username);
          if (!admin) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          // 비밀번호 확인 (평문 비교)
          if (password !== admin.password) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, admin);
        } catch (error) {
          console.error('Auth Error:', error);
          return done(error);
        }
      },
    ),
  );
};

export default LocalStrategy;
