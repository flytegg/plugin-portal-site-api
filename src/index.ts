import { authMiddleware } from "@/pkg/middleware/auth";
import { newApp } from "./pkg/hono/app";
import { getPluginsRoute } from "@/routes/v1/plugins/get-plugins";

const app = newApp();

app.use("/v1/*", authMiddleware);

app.get("/", (c) => c.text("Hello World"));

getPluginsRoute(app)

console.log("[API] Starting server...");

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
}