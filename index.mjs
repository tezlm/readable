import http from "http";
import parse from "./js/parse.mjs";
import fs from "fs";

const index = fs.readFileSync("html/index.html", "utf8");

http.createServer(async (req, res) => {
	const params = new URL(req.url, "https://celery.eu.org/").searchParams;
	if(!params.has("url")) return res.end(index);
	const url = decodeURIComponent(params.get("url"));
	res.writeHead(200).end(await parse(url));
}).listen(8734);

