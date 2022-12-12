import http from "http";
import parse from "./js/parse.mjs";
import fs from "fs";
import sqlite3 from "better-sqlite3";
import { customAlphabet as createNanoid } from "nanoid";
import express from "express";

const nanoid = createNanoid("abcdefgjijklmnopqrstuvwxyzABCDEFGJIJKLMNOPQRSTUVWXYZ0123456789", 10);
const db = sqlite3("readability.db");
const app = express();

db.prepare("CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, url TEXT, html TEXT)").run();

const index = fs.readFileSync("html/index.html", "utf8");
const notfound = fs.readFileSync("html/404.html", "utf8");

app.get("/read", async (req, res) => {
	const { url, force } = req.query;
	
	if(!url) return res.send(index);

	const row = db.prepare("SELECT * FROM articles WHERE url = ?").get(url);
	if (row) {
		if (!force) {
			return res.redirect(`/read/${row.id}`);
		} else {
			db.prepare("UPDATE articles SET url = null WHERE id = ?").run(row.id);
		}		
	}
	
	const parsed = await parse(url);
	const id = nanoid();
	db.prepare("INSERT INTO articles (id, url, html) VALUES (?, ?, ?)").run(id, url, parsed);
	res.redirect(`/read/${id}`);
});

app.get("/read/:id", async (req, res, next) => {
	const row = db.prepare("SELECT * FROM articles WHERE id = ?").get(req.params.id);
	if (!row) return next();
	res.send(row.html);
});

app.get("*", async (req, res) => {
	res.send(notfound);
});

app.listen(8734, () => console.log("ready!"));
