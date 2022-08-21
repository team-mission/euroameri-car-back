import express, { Request, Response } from 'express';
import passport from 'passport';

import wrapAsync from '@utils/wrapAsync';
import { UnauthorizedError } from '@errors/customErrors';
import { isLoggedIn, isNotLoggedIn } from './middleware';

const router = express.Router();

router.post('/login', isNotLoggedIn, async (req, res, next) => {
  passport.authenticate('local', (err, data, info) => {
    if (err) {
      return next(err);
    }

    if (info) {
      return res.status(401).send({ msg: info.message });
    }

    return res.end();
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
