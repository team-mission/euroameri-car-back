export {};

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}
