const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "build",
  });
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server running at http://127.0.0.1:' + port + '/');
})
