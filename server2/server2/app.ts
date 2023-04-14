import http, { IncomingMessage, Server, ServerResponse } from "http";
import puppeteer from "puppeteer";

const server: Server = http.createServer(async(req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://leecodes-bit.github.io/lyft/#", {
        waitUntil: "domcontentloaded",
        timeout: 0
      });
  
  const values = await page.evaluate(()=> Array.from(document.querySelectorAll('.vaccine'), (e)=>({
    title: e.querySelector('.heading')?.innerHTML,
    description: e.querySelector('p')?.innerHTML, 
    imageUrl: e.querySelector('.img-fluid')?.getAttribute("src")
  })
  ))
      res.end(JSON.stringify(values, null, '\n'));
      await browser.close();
    }
  }
);

server.listen(3001);
