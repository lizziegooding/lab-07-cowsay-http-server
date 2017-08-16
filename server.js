'use strict';

//http localhost:3000/pathname?query=string
// echo '{"text":"howdy"}' | http post localhost:3000/cowsay

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cowsay = require('cowsay');

const server = http.createServer((request, response) => {

  request.url = url.parse(request.url);
  request.url.query = querystring.parse(request.url.query);

  if (request.url.pathname === '/') {
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.write('hello world');
    response.end();
    return;
  }

  if (request.method === 'GET') {
    if (typeof request.url.query.text === 'string') {
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.write(cowsay.say(request.url.query));
    response.end();
    return;
    }

    response.writeHead(400, {
      'Content-Type': 'text/plain',
    });
    response.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
    response.end();
    return;
  }

  if (request.method === 'POST') {
    bodyParse(request, (error, body) => {
      if (error) {
        response.writeHead(500);
        response.end();
        return;
      }
      try {
        request.body = JSON.parse(body);
      } catch (error) {
        response.writeHead(400);
        response.end();
        return;
      }
    if (typeof request.body.text === 'string') {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.write(cowsay.say(request.body));
      response.end();
      return;
    }
    response.writeHead(400, {
      'Content-Type': 'text/plain',
    });
    response.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
    response.end();
    return;
});
}

});

const bodyParse = (request, callback) => {
  let body = '';
  request.on('data', (data) => {
    body += data.toString();
  });
  request.on('end', () => callback(null, body));
  request.on('error', (error) => callback(error));
};

server.listen(3000, () => {
  console.log('server up :: 3000');
});
