import {z} from "@hono/zod-openapi";
import {Context} from "hono";
import {HonoEnv} from "../hono/env";
import { StatusCode } from "hono/utils/http-status";

export function errorSchema(code: number, name: string, message: string) {
    return z.object({
        error: z.object({
            statusCode: z.number().openapi({
                description: "The HTTP status code",
                example: code
            }),

            name: z.string().openapi({
                description: "The name of the status code",
                example: name
            }),

            message: z.string().openapi({
                description: "The error message",
                example: message
            })
        })
    })
}

export function errorBuilder(c: Context<HonoEnv, string>, code: StatusCode, name: string, message: string) {
    return c.json({
        error: {
            statusCode: code,
            name,
            message
        }
    }, code)
}

export const BadRequest = errorSchema(400, "Bad Request", "The request is invalid")
export const UnauthorizedRequest = errorSchema(401, "Unauthorized", "You are not authorized to access this resource")
export const ForbiddenRequest = errorSchema(403, "Forbidden", "You do not have access to this resource")
export const NotFound = errorSchema(404, "Not Found", "The requested resource was not found")