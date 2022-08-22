import bcrypt from 'bcrypt';

import AppDataSource from '@database/dataSource';
import Post from '@database/entities/post';
import Image from '@database/entities/image';
import Comment from '@database/entities/comment';
import {
  ServerError,
  BadRequestError,
  UnauthorizedError,
} from '@errors/customErrors';

// 게시물 목록 조회
export const getPostList = async (page: number, display: number) => {
  const postListData = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .orderBy('post.createdAt')
    .offset((page - 1) * display)
    .limit(display)
    .getMany();

  return postListData;
};

// 일반 게시물 정보 조회
export const getNormalPost = async (postId: number) => {
  const postData = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .where('post.id = :postId', { postId })
    .leftJoinAndSelect('post.images', 'images')
    .getOne();

  if (!postData) {
    throw new BadRequestError('존재하지 않는 게시물에 대한 조회 요청');
  }

  if (postData?.secret) {
    throw new UnauthorizedError('비밀 게시물에 대한 조회 요청입니다.');
  }

  // 일반글
  return postData;
};

// 비밀 게시물 정보 조회
export const getSecretPost = async (postId: number, password: string) => {
  const postData = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .select(['post', 'post.password'])
    .where('post.id = :postId', { postId })
    .leftJoinAndSelect('post.images', 'images')
    .getOne();

  if (!postData) {
    throw new BadRequestError('존재하지 않는 게시물에 대한 조회 요청');
  }

  if (!password) {
    throw new UnauthorizedError('비밀번호를 입력해야합니다.');
  }

  const result = await bcrypt.compare(password, postData.password);

  if (!result) {
    throw new UnauthorizedError('잘못된 비밀번호');
  }

  const { password: hashedPassword, ...filteredPostData } = postData;
  return filteredPostData;
};

// 게시물 정보 조회 (관리자용)
export const getPostForAdmin = async (postId: number) => {
  const postData = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .select(['post', 'post.email', 'post.phone'])
    .where('post.id = :postId', { postId })
    .leftJoinAndSelect('post.images', 'images')
    .getOne();

  if (!postData) {
    throw new BadRequestError('존재하지 않는 게시물에 대한 조회 요청');
  }

  return postData;
};

// 게시물 작성
export const addPost = async (
  title: string,
  content: string,
  name: string,
  email: string,
  phone: string,
  images: string[],
  secret: boolean,
  password: string,
) => {
  const newPost = new Post();
  newPost.title = title;
  newPost.content = content;
  newPost.name = name;
  newPost.email = email;
  newPost.phone = phone;
  newPost.secret = secret;

  const hashedPassword = await bcrypt.hash(password, 12);
  newPost.password = hashedPassword;

  const insertPostResult = await AppDataSource.getRepository(Post)
    .createQueryBuilder()
    .insert()
    .into('post')
    .values(newPost)
    .updateEntity(false)
    .execute();

  const postId = insertPostResult.raw.insertId;
  newPost.id = postId;

  // 이미지 추가
  const newImages = images.map(async (img) => {
    const newImage = new Image();
    newImage.post = newPost;
    newImage.src = img;

    await AppDataSource.getRepository(Image)
      .createQueryBuilder()
      .insert()
      .into('image')
      .values(newImage)
      .updateEntity(false)
      .execute();

    return newImage;
  });

  await Promise.all(newImages);

  return { id: postId };
};

// 게시물 삭제
export const deletePost = async (postId: number, password: string) => {
  const postData = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .select(['post.password'])
    .where('post.id = :postId', { postId })
    .getOne();

  if (!postData) {
    throw new BadRequestError('존재하지 않는 게시물에 대한 삭제 요청');
  }

  const result = await bcrypt.compare(password, postData.password);

  if (!result) {
    throw new UnauthorizedError('잘못된 비밀번호');
  }

  const deletePostResult = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .softDelete()
    .where('post.id = :postId', { postId })
    .execute();

  if (deletePostResult.affected !== 1) {
    throw new ServerError('게시물 삭제 실패');
  }
};

// 게시물 삭제 (관리자용)
export const deletePostForAdmin = async (postId: number) => {
  const deletePostResult = await AppDataSource.getRepository(Post)
    .createQueryBuilder('post')
    .softDelete()
    .where('post.id = :postId', { postId })
    .execute();

  if (deletePostResult.affected !== 1) {
    throw new ServerError('게시물 삭제 실패');
  }
};

// 댓글 조회
export const getCommentList = async (postId: number) => {
  const commentListData = await AppDataSource.getRepository(Comment)
    .createQueryBuilder('comment')
    .where('comment.post_id = :postId', { postId })
    .orderBy('comment.createdAt')
    .getMany();

  return commentListData;
};

// 댓글 작성 (관리자용)
export const addComment = async (postId: number, content: string) => {
  const post = new Post();
  post.id = postId;

  const newComment = new Comment();
  newComment.content = content;
  newComment.post = post;

  await AppDataSource.getRepository(Comment)
    .createQueryBuilder()
    .insert()
    .into('comment')
    .values(newComment)
    .updateEntity(false)
    .execute();
};

// 댓글 삭제 (관리자용)
export const deleteComment = async (postId: number, commId: number) => {
  const deleteCommentResult = await AppDataSource.getRepository(Comment)
    .createQueryBuilder('comment')
    .softDelete()
    .where('comment.id = :commId', { commId })
    .andWhere('comment.post_id = :postId', { postId })
    .execute();

  if (deleteCommentResult.affected !== 1) {
    throw new ServerError('댓글 삭제 실패');
  }
};
