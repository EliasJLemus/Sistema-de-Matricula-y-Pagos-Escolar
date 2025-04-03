import {Request} from "express"

export const getPaginationParams = (req: Request) => {
  const getAll = req.query.getAll === "true";
  const page = parseInt(req.query.page as string) || 1;
  const limit = getAll ? 10000 : parseInt(req.query.limit as string) || 10;
  const offset = getAll ? 0 : (page - 1) * limit;

  return { limit, offset, getAll, page };
};