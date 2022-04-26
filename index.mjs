import http from "http";
import parse from "./js/parse.mjs";
import fs from "fs";
import LRU from "lru-cache";

const index = fs.readFileSync("html/index.html", "utf8");
const cache = new LRU({ max: 2048 });

http.createServer(async (req, res) => {
	const params = new URL(req.url, "https://celery.eu.org/").searchParams;
	if(!params.has("url")) return res.end(index);
	
	const url = decodeURIComponent(params.get("url"));
	if(cache.has(url)) return res.end(cache.get(url));

	const parsed = await parse(url);
	cache.set(url, parsed);
	res.end(parsed);
}).listen(8734);
