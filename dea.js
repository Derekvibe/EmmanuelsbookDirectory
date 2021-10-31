/**
Book Directory 
*/

const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const dea1r = require('./lib/dea1r');

const httpServer = http.createServer((req, res) => {
  const parsedurl = url.parse(req.url, true);
  const pathname = parsedurl.pathname;
  const trimedPath = pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObj = parsedurl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();


    const parsedPayload = buffer !== "" ? JSON.parse(buffer) : {};

    const data = {
      trimedPath: trimedPath,
      query: queryStringObj,
      method: method,
      headers: headers,
      payload: parsedPayload
    };

    const chosenHandler = typeof (router[trimedPath]) !== 'undefined' ? router[trimedPath] : router.notAvailable;
    chosenHandler(data, (statusCode, result) => {

      statusCode = typeof (statusCode) === 'number' ? statusCode : 400;
      result = typeof (res) === 'object' ? result : {};

      const responseObj = JSON.stringify(result);

      res.setHeader('Content-type', "application/json");
      res.writeHead(statusCode);

      res.write(responseObj);
      res.end();

      console.log(`the visited url was, ${trimedPath} and the method is ${method}`);
    });
  });
});

//start listening on port 8000
httpServer.listen(8000, () => {
  console.log("server is listening on port 8000");
});

const router = {
  ping: dea1r.ping,
  books: dea1r.books,
  notAvailable: dea1r.notAvailable
};


