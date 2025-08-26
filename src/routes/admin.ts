import express from 'express';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from './middleware';

const router = express.Router();

// 인증 상태 확인
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      admin: req.user,
    });
  }

  return res.status(200).json({
    isAuthenticated: false,
  });
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
  passport.authenticate('local', (isError, data, errInfo) => {
    if (isError) {
      return next(isError);
    }

    if (errInfo) {
      return res.status(401).send({ msg: errInfo.message });
    }

    return req.login(data, async (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.status(200).send();
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(400).json({ msg: 'Logout Error' });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(400).json({ msg: 'Session Destroy Error' });
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({ msg: 'Logout Success' });
    });
  });
});

export default router;
