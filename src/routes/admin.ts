import express, { Request, Response } from 'express';
import passport from 'passport';

import wrapAsync from '@utils/wrapAsync';
import { UnauthorizedError } from '@errors/customErrors';
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

router.post(
  '/logout',
  isLoggedIn,
  wrapAsync((req: Request, res: Response) => {
    req.logout((err) => {
      throw new UnauthorizedError(err);
    });

    req.session.destroy((err) => {
      throw new UnauthorizedError(err);
    });

    res.end();
  }),
);

export default router;
