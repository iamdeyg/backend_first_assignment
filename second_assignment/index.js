const http = require("http");
const process = require("process");
const {
  productWithID,
  productWithoutId,
} = require("./route/inventory_route.js");

//Accept custom PORT number and set default to 8000
const PORT = process.argv[2] ?? 8000;
const HOST_NAME = "localhost";

//create the server request handler function
function requestHandler(req, res) {
  //check if request url is / or /products and
  if (req.url === "/" || req.url === "/products") {
    productWithoutId(req, res);
  }
  // getting parameters using match and regular expression
  else if (req.url.match(/\/products\/([0-9]+)/)) {
    productWithID(req, res);
  }
  //if the request does not match as intended, return 404 page
  else {
    res.writeHead(404);
    res.write(JSON.stringify({ message: "Not Found" }));
    res.end();
  }
}

//create and listen to the server
const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  console.log(`server is running on http://${HOST_NAME}:${PORT}`);
});
