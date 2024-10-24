const http = require("http");
const fs = require("fs");
const path = require("path");

const HOSTNAME = "localhost";
const PORT = 4000;

const pathToFile = path.join(__dirname, "index.html");
const pathToErrFile = path.join(__dirname, "404.html");

//create the server request handler function
function requestHandler(req, res) {
  //check if request url is / or index.html and the request method is GET
  if (req.url == "/index.html" && req.method == "GET") {
    fs.readFile(pathToFile, "utf8", (err, data) => {
      if (err) {
        console.log("File not found");
        res.end();
      } else {
        console.log("Indexpage");
        res.writeHead(200, {
          contentType: "text/html",
        });
        res.write(data);
        res.end();
      }
    });
  }
  //if the request does not match as intended, return 404 page
  else {
    fs.readFile(pathToErrFile, "utf8", (err, data) => {
      if (err) {
        console.log("File not found");
        res.end();
      } else {
        res.writeHead(404, {
          contentType: "text/html",
        });
        res.write(data);
        res.end();
      }
    });
  }
}
//create and listen to the server
const server = http.createServer(requestHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log("Server is running");
});
