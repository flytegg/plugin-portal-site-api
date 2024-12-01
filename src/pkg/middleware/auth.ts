import { Context, MiddlewareHandler, Next } from "hono";
import { HonoEnv } from "../hono/env";


export const authMiddleware: MiddlewareHandler<HonoEnv> = async (
  c: Context<HonoEnv>,
  next: Next,
) => {
  return await next()
};
