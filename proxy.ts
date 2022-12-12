import { customAlphabet as createNanoid } from "nanoid";
import { Database } from "bun:sqlite";
import { Hono } from "hono";

const nanoid = createNanoid("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);
const db = new Database("readability.db");
const app = new Hono();

db.run("CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, url TEXT, title TEXT, html TEXT)");

console.log(nanoid());

export default {
  port: Bun.env.PORT ?? 8734,
  fetch: app.fetch,
}
