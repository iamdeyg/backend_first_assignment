const http = require("http");
const process = require("process");
const {
  productWithID,
  productWithoutId,
} = require("./route/inventory_route.js");

const PORT = process.argv[2] ?? 8000;
const HOSTNAME = "localhost";

//creates the server request handler function
function requestHandler(req, res) {
  //it checks if request url is / or /products
  if (req.url === "/" || req.url === "/products") {
    productWithoutId(req, res);
  }
  // getting parameters using match and regular expression
  else if (req.url.match(/\/products\/([0-9]+)/)) {
    productWithID(req, res);
  }
  //return 404 page if the request does not match as intended,
  else {
    res.writeHead(404);
    res.write(JSON.stringify({ message: "Not Found" }));
    res.end();
  }
}

//creates and listens to the server
const server = http.createServer(requestHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log(`server is running on http://${HOSTNAME}:${PORT}`);
});
