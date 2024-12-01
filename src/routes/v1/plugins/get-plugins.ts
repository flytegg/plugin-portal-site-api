import { PluginModel, ZodPlugin } from "@/pkg/db/schema/plugin";
import { App } from "@/pkg/hono/app";
import { createRoute, z } from "@hono/zod-openapi";
import BunCache from "@samocodes/bun-cache";

const route = createRoute({
  method: "get",
  path: "/v1/plugins",
  tags: ["Plugins"],
  request: {
    query: z.object({
      offset: z.number().default(0),
      limit: z.number().default(50).refine(value => Number.isInteger(value) && value >= 1 && value <= 50, {
        message: "Page size must be an integer between 1 and 50",
        path: ["limit"]
      }),

      prefix: z.string().optional(),
    })
  },

  responses: {
    200: {
      description: "Success fetched plugins",
      content: {
        "application/json": {
          schema: z.array(ZodPlugin)
        },
      },
    },
  },
})

export const getPluginsRoute = (app: App) => {
  app.openapi(route, async (c) => {
    const { offset, limit, prefix } = c.req.valid("query");

    const cache: BunCache = c.get("cache") as BunCache;
    const cacheKey = `plugins:${prefix}:${offset}:${limit}`;

    if (cache.hasKey(cacheKey)) return c.json(cache.get(cacheKey));

    const plugins = await PluginModel.find({
      name: { $regex: prefix ?? "", $options: "i" },
    }).skip(offset).limit(limit);

    cache.put(cacheKey, plugins, 1000 * 60)

    return c.json({
      plugins
    })
  })
}