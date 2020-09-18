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
            const filePath = './' + name;

            fetch(link)
                .then(fetchRes => fetchRes.buffer())
                .then(buffer => {
                    console.log('file fetched');
                    fs.writeFile(filePath, buffer, () => {
                        console.log('file wrote to disk');
                        res.writeHead(200, {
                            'content-disposition': `attachment; filename=${name}`,
                            'content-type': 'application/octet-stream',
                        });
                        fs.createReadStream(filePath).pipe(res);
                    });
                })
                .catch(err => res.end(err.message))
                .finally(() => fs.unlinkSync(filePath));
        }
    })
    .listen(process.env.PORT || 4000, () => console.log('server listening'));
