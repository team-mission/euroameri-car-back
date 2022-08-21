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
      async (uid, password, done) => {
        // 아이디 조회
        const admin = await getAdminDataByUid(uid);
        if (!admin) {
          return done(null, false, { message: 'Unauthorized' });
        }

        // 비밀번호 확인
        if (password !== admin.password) {
          return done(null, false, { message: 'Unauthorized' });
        }

        return done(null, admin);
      },
    ),
  );
};

export default LocalStrategy;
