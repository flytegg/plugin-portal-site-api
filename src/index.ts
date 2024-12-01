import { authMiddleware } from "@/pkg/middleware/auth";
import { newApp } from "./pkg/hono/app";

const app = newApp();

app.use("/v1/*", authMiddleware);

console.log("[API] Starting server...");