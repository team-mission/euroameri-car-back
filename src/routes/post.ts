import express, { Request, Response } from 'express';

import wrapAsync from '@utils/wrapAsync';
import {
  getNormalPost,
  getSecretPost,
  getPostForAdmin,
  addPost,
  deletePostForAdmin,
  deletePost,
  getCommentList,
  addComment,
  deleteComment,
} from '@database/controllers/post';
import { BadRequestError } from '@errors/customErrors';
import { checkUserType, isLoggedIn } from './middleware';

const router = express.Router();

// 일반 게시물 정보 조회
router.post(
  '/normal/:postId',
  checkUserType,
  wrapAsync(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId를 포함한 요청입니다.');
    }

    // 관리자
    if (req.isAdmin) {
      const postData = await getPostForAdmin(postId);
      return res.json(postData);
    }

    // 유저
    const postData = await getNormalPost(postId);

    return res.json(postData);
  }),
);

// 비밀 게시물 정보 조회
router.post(
  '/secret/:postId',
  checkUserType,
  wrapAsync(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);
    const { password } = req.body;

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId를 포함한 요청입니다.');
    }

    // 관리자
    if (req.isAdmin) {
      const postData = await getPostForAdmin(postId);
      return res.json(postData);
    }

    // 유저
    const postData = await getSecretPost(postId, password);

    return res.json(postData);
  }),
);

// 게시물 작성
router.post(
  '/',
  wrapAsync(async (req: Request, res: Response) => {
    const { title, content, name, email, phone, images, secret, password } =
      req.body;

    if (!title || !content || !name || !email || !phone || !images) {
      throw new BadRequestError('일부 정보가 누락된 요청입니다.');
    }

    const result = await addPost(
      title,
      content,
      name,
      email,
      phone,
      images,
      secret,
      password,
    );

    return res.json(result);
  }),
);

// 게시물 삭제
router.delete(
  '/:postId',
  checkUserType,
  wrapAsync(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId를 포함한 요청입니다.');
    }

    // 관리자
    if (req.isAdmin) {
      await deletePostForAdmin(postId);
      return res.end();
    }

    // 유저
    const { password } = req.body;
    await deletePost(postId, password);
    return res.end();
  }),
);

// 댓글 조회
router.get(
  '/:postId/comment',
  wrapAsync(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId를 포함한 요청입니다.');
    }

    const commentListData = await getCommentList(postId);
    return res.json(commentListData);
  }),
);

// 댓글 작성
router.post(
  '/:postId/comment',
  isLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);
    const { content } = req.body;

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId를 포함한 요청입니다.');
    }

    if (!content) {
      throw new BadRequestError('일부 정보가 누락된 요청입니다.');
    }

    await addComment(postId, content);
    res.end();
  }),
);

// 댓글 삭제
router.delete(
  '/:postId/comment/:commId',
  isLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postId, commId] = [
      Number(req.params.postId),
      Number(req.params.commId),
    ];

    if (!postId || !commId) {
      throw new BadRequestError(
        '올바르지 않은 postId or commId를 포함한 요청입니다.',
      );
    }

    await deleteComment(postId, commId);
    return res.end();
  }),
);

export default router;
