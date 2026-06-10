const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 7788;
const DIR = '/Users/dubu/Documents/Claude_Project/TRADE_LOG';
http.createServer((req, res) => {
  const url = req.url === '/' ? '/icon_preview.html' : req.url;
  fs.readFile(path.join(DIR, url), (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript'};
    res.writeHead(200, {'Content-Type': mime[path.extname(url)] || 'text/plain'});
    res.end(data);
  });
}).listen(PORT, () => console.log('ok'));
