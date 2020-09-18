const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');

http
    .createServer((req, res) => {
        const { pathname, query } = url.parse(req.url, true);

        if (pathname === '/' && req.method === 'GET') {
            res.end('🙏');
        }

        if (pathname === '/download' && req.method === 'GET') {
            console.log('GET /download api hit');

            const { link, name } = query;

            fetch(link)
                .then(fetchRes => fetchRes.buffer())
                .then(buffer => {
                    fs.writeFileSync(name, buffer);
                    res.writeHead(200, {
                        'content-disposition': `attachment; filename=${name}`,
                        'content-type': 'application/octet-stream',
                    });
                    fs.createReadStream(name).pipe(res);
                })
                .catch(err => res.end(err.message))
                .finally(() => fs.unlinkSync(name));
        }
    })
    .listen(process.env.PORT || 4000, () => console.log('server listening'));
