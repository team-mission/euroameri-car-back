import express, { Request, Response } from 'express';

import wrapAsync from '@utils/wrapAsync';
import { getPostList } from '@database/controllers/post';
import { BadRequestError } from '@errors/customErrors';

const router = express.Router();

router.get(
  '/',
  wrapAsync(async (req: Request, res: Response) => {
    const { page = '1', display = '10' } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (displayNum > 0 && pageNum > 0) {
      const postListData = await getPostList(pageNum, displayNum);
      return res.json(postListData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
