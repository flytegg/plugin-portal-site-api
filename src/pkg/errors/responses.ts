import {BadRequest, ForbiddenRequest, NotFound, UnauthorizedRequest} from "./schemas";

export const openAPIErrorResponses = {
    400: {
        description: "Bad Request, client provided invalid data in the request body",
        content: {
            "application/json": {
                schema: BadRequest
            }
        }
    },
    401: {
        description: "Unauthorized request, client must provide a valid Bearer token in the Authorization header",
        content: {
            "application/json": {
                schema: UnauthorizedRequest
            }
        }
    },
    403: {
        description: "Forbidden request, client does not have access to this resource",
        content: {
            "application/json": {
                schema: ForbiddenRequest
            }
        }
    },
    404: {
        description: "Not Found, the requested resource was not found",
        content: {
            "application/json": {
                schema: NotFound
            }
        }
    }
}