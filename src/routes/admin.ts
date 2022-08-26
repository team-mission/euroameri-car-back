import express from 'express';
import passport from 'passport';

import { BadRequestError } from '@errors/customErrors';
import { isLoggedIn, isNotLoggedIn } from './middleware';

const router = express.Router();

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
      throw new BadRequestError(err);
    }
  });
  req.session.destroy((err) => {
    if (err) {
      throw new BadRequestError(err);
    }
  });
  res.send('ok');
});

export default router;
