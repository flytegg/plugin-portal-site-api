import { OpenAPIHono } from "@hono/zod-openapi";
import { prettyJSON } from "hono/pretty-json";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import BunCache from "@samocodes/bun-cache";
import { HonoEnv } from "@/pkg/hono/env";
import { apiReference } from "@scalar/hono-api-reference";
import { clerkMiddleware } from "@hono/clerk-auth";

export function newApp() {
  const app = new OpenAPIHono<HonoEnv>();

  app.use(clerkMiddleware())
  app.use(logger());
  app.use(prettyJSON());
  app.use(cors());

  app.get("*", async (c, next) => {
    c.set("cache", new BunCache(true));

    await next();
  });

  app.get(
    "/reference",
    apiReference({
      theme: "saturn",
      spec: {
        url: "/openapi.json",
      },
    }),
  );

  app.doc("/openapi.json", (c) => ({
    openapi: "3.0.0",
    info: {
      title: "Plugin Portal Site API",
      version: "1.0.0",
      description: "The API for the Plugin Portal Site",
      contact: {
        url: "https://pluginportal.link",
        name: "Plugin Portal",
        email: "hello@flyte.gg",
      },
    },
  }));

  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  return app;
}

export type App = ReturnType<typeof newApp>;
