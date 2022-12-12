import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import createDOMPurify from 'dompurify';
import fetch from "node-fetch";
import fs from "fs";
import fmtSize from "./size.mjs";

const template = fs.readFileSync("html/article.html", "utf8");
const dompurify = createDOMPurify(new JSDOM('').window);

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
	// "User-Agent": "AdsBot-Google (+http://www.google.com/adsbot.html)",
};

export default async function parse(url) {
	const content = await fetch(url, { headers }).then(res => res.text()).catch(() => null);
	if (content === null) return error;

	const doc = new JSDOM(content, { url });
	if(!isProbablyReaderable(doc.window.document)) throw "not readerable";
	
	const reader = new Readability(doc.window.document);
	const article = reader.parse();
	
	return template
		.replace(/@lang/g,    article.lang)
		.replace(/@byline/g,  article.byline ? `by ${article.byline} - `: "")
		.replace(/@size/g,    fmtSize(article.length))
		.replace(/@url/g,     url)
		.replace(/@title/g,   article.title)
		.replace(/@excerpt/g, article.excerpt)
		.replace(/@body/g,    dompurify.sanitize(article.content));
}
