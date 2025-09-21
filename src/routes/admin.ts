import express from 'express';
import passport from 'passport';

import { BadRequestError } from '@errors/customErrors';
import { isLoggedIn, isNotLoggedIn } from './middleware';

const router = express.Router();

router.post('/login', isNotLoggedIn, async (req, res, next) => {
  console.log('Login attempt with data:', {
    uid: req.body.uid,
    password: req.body.password ? '***' : 'undefined',
  });

  passport.authenticate('local', (isError, data, errInfo) => {
    if (isError) {
      console.error('Passport authentication error:', isError);
      return next(isError);
    }

    if (errInfo) {
      console.log('Authentication failed:', errInfo.message);
      return res.status(401).json({ msg: errInfo.message });
    }

    console.log('Authentication successful, user:', data);

    return req.login(data, async (loginError) => {
      if (loginError) {
        console.error('Login error:', loginError);
        return next(loginError);
      }

      console.log('Login successful, session created');
      return res.status(200).json({ msg: '로그인 성공' });
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
  console.log('Logout attempt for user:', req.user);
  console.log('Session before logout:', req.session);

  // 세션 제거
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ msg: '세션 제거 실패' });
    }

    // 쿠키 삭제
    res.clearCookie('euroameri.sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    console.log('Logout successful');
    return res.status(200).json({ msg: '로그아웃 성공' });
  });
});

export default router;
