const path = require("path");
const fs = require("fs");

const productFilePath = path.join(__dirname, "../db", "inventory.json");

//all products from the database
function getAllProducts(req, res) {
  fs.readFile(productFilePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.write(JSON.stringify({ message: "Unable to fetch Products" }));
      res.end();
    }
    const products = JSON.parse(data);
    res.writeHead(200);
    res.write(
      JSON.stringify({ message: "Products Retrieved", data: products })
    );
    res.end();
  });
}

//single product from the database
function getProductById(req, res, id) {
  fs.readFile(productFilePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.write(JSON.stringify({ message: "Unable to fetch product" }));
      res.end();
    }
    const products = JSON.parse(data);

    // get the index of the product
    const productIndex = products.findIndex((product) => {
      return product.id === id;
    });

    if (productIndex === -1) {
      res.writeHead(404);
      res.write(JSON.stringify({ message: "Product not found" }));
      res.end();
    } else {
      res.writeHead(200);
      res.write(
        JSON.stringify({
          message: "Product retrieved Successfully",
          data: products[productIndex],
        })
      );
      res.end();
    }
  });
}
//enter a new product into the database
function createProduct(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const newProduct = JSON.parse(body);
    //read the db files
    fs.readFile(productFilePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.write(JSON.stringify({ message: "Unable to fetch products" }));
        res.end();
      } else {
        const products = JSON.parse(data);

        const lastProductId = products[products.length - 1].id;

        newProduct.id = lastProductId + 1;

        products.push(newProduct);

        const allProducts = JSON.stringify(products);

        fs.writeFile(productFilePath, allProducts, (err) => {
          if (err) {
            res.writeHead(500);
            res.write(JSON.stringify({ message: "Unable to save product" }));
            res.end();
          } else {
            res.writeHead(201);
            res.write(
              JSON.stringify({
                message: "Product created successfully",
                data: products,
              })
            );
            res.end();
          }
        });
      }
    });
  });
}

//update specific product in the database
function updateProductById(req, res, id) {
  let body = "";
  //get sent data to be updated
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const updateBody = JSON.parse(body);

    //retrieve all products
    fs.readFile(productFilePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.write(JSON.stringify({ message: "Unable to retrieve products" }));
        res.end();
      } else {
        const products = JSON.parse(data);

        const productIndex = products.findIndex((product) => product.id === id);
        products[productIndex] = { ...products[productIndex], ...updateBody };

        const updatedProducts = JSON.stringify(products);
        //saves product back into the database
        fs.writeFile(productFilePath, updatedProducts, (err) => {
          if (err) {
            res.writeHead(500);
            res.write(JSON.stringify({ message: "Unable to Update product" }));
            res.end();
          } else {
            res.writeHead(201);
            res.write(
              JSON.stringify({
                message: "Product Updated Successfully",
                data: products[productIndex],
              })
            );
            res.end();
          }
        });
      }
    });
  });
}

//delete a product from the database
function deleteProductById(req, res, id) {
  // get the product from database
  fs.readFile(productFilePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.write("Unable to fetch Product");
      res.end();
    }
    const products = JSON.parse(data);

    // get the index of the product
    const productIndex = products.findIndex((product) => {
      return product.id === id;
    });

    if (productIndex === -1) {
      res.writeHead(404);
      res.end("Product Not Found");
    } else {
      // remove product from the database
      products.splice(productIndex, 1);

      const newProducts = JSON.stringify(products);
      fs.writeFile(productFilePath, newProducts, (err) => {
        if (err) {
          res.writeHead(500);
          res.end("Unable to Delete File");
        }
        res.writeHead(200);
        res.end(newProducts);
      });
    }
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
