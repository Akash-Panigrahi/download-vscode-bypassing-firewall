const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');

http
    .createServer((req, res) => {
        const { pathname, query } = url.parse(req.url, true);

        if (pathname === '/download' && req.method === 'GET') {
            const { link, name } = query;
            const filePath = './' + name;

            fetch(link)
                .then(fetchRes => fetchRes.buffer())
                .then(buffer => {
                    fs.writeFile(filePath, buffer, () => {
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
    .listen(3000, () => console.log('server listening on ->', 3000));
