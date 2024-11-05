const {
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  createProduct,
} = require("../controller/inventory_controller");

function productWithID(req, res) {
  const id = req.url.split("/")[2];
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    res.writeHead(400);
    res.write(JSON.stringify({ message: "Invalid Request" }));
    res.end();
  }
  //switch between the request methods and return the corresponding controller method.
  switch (req.method) {
    case "GET":
      getProductById(req, res, parsedId);
      break;
    case "PUT":
      updateProductById(req, res, parsedId);
      break;
    case "PATCH":
      updateProductById(req, res, parsedId);
      break;
    case "DELETE":
      deleteProductById(req, res, parsedId);
      break;
    default:
      res.writeHead(400);
      res.write(JSON.stringify({ message: "Invalid Request" }));
      res.end();
  }
}

//checks for normal route without id
function productWithoutId(req, res) {
  if (req.method === "GET") {
    //get all products
    getAllProducts(req, res);
  } else if (req.method === "POST") {
    createProduct(req, res);
  } else {
    //return invalid request
    res.writeHead(400);
    res.write(JSON.stringify({ message: "Invalid Request" }));
    res.end();
  }
}

module.exports = {
  productWithID,
  productWithoutId,
};
