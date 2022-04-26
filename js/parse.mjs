import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fs from "fs";
import fmtSize from "./size.mjs";

const template = fs.readFileSync("html/article.html", "utf8");
const error = fs.readFileSync("html/error.html", "utf8");

export default async function parse(url) {
	const content = await fetch(url).then(res => res.text()).catch(() => null);
	if (content === null) return error;

	const doc = new JSDOM(content, { url });
	if(!isProbablyReaderable(doc.window.document)) return error;
	
	const reader = new Readability(doc.window.document);
	const article = reader.parse();
	return template
		.replace(/@url/g,   url)
		.replace(/@title/g, article.title)
		.replace(/@lang/g,  article.lang)
		.replace(/@title/g, article.title)
		.replace(/@size/g,  fmtSize(article.length))
		.replace(/@body/g,  article.content);
}

