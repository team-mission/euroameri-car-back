import passport from 'passport';

import { getAdminDataByUid } from '@database/controllers/admin';
import { UnauthorizedError } from '@errors/customErrors';
import LocalStrategy from './strategy';

const configurePassport = () => {
  passport.serializeUser((admin: any, done) => done(null, admin.uid));

  passport.deserializeUser(async (uid: string, done) => {
    try {
      const adminData = await getAdminDataByUid(uid);
      if (adminData) {
        return done(null, adminData);
      }

      throw new UnauthorizedError('관리자 로그인 실패');
    } catch (error) {
      return done(error);
    }
  });

  LocalStrategy();
};

export default configurePassport;
