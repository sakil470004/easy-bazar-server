const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// env config
const env = require("dotenv");
env.config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
    },
    "mysecretkey"
  );
}
async function verifyToken(req, res, next) {
  const token = await req.headers.authorization.split(" ")[1];
  await jwt.verify(token, "mysecretkey", (err, decoded) => {
    if (err) {
      res.status(401).send({ status: "Invalid token" });
      return;
    }
    next();
  });
}

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    client.connect();
    console.log("DB Connected Successfully");
    const database = client.db("easy-bazar-db");
    const productCollection = database.collection("products");
    const categoryCollection = database.collection("categories");
    const userCollection = database.collection("users");
    // category routes
    app.post("/categories", async (req, res) => {
      const category = req.body;
      const result = await categoryCollection.insertOne(category);
      res.json(result);
    });
    app.get("/categories", async (req, res) => {
      const cursor = categoryCollection.find({});
      const categories = await cursor.toArray();
      res.json(categories);
    });

    // product routes
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);

      res.json(result);
    });
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const { _id, ...restUpdate } = updatedProduct;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: restUpdate,
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(product);
    });

    // user routes
    app.post("/users", async (req, res) => {
      const user = req.body;
      const token = createToken(user);
      const filter = { email: user.email };
      if (user.email === "") {
        res.status(400).send({ status: "Email  can not be empty" });
        return;
      }
      const existingUser = await userCollection.findOne(filter);
      if (existingUser) {
        res.status(400).send({ status: "Success Email already exists",token });
        return;
      }
      const result = await userCollection.insertOne(user);
      res.json({ status: "Success add user to DB", token });
    });
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      res.json(user);
    });
    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updatedUser = req.body;
      const { _id, ...restUpdate } = updatedUser;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: restUpdate,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // // product routes
    // app.post("/shoes", async (req, res) => {
    //   const shoe = req.body;
    //   const result = await shoeCollection.insertOne(shoe);
    //   res.json(result);
    // });
    // // get all products
    // app.get("/shoes", async (req, res) => {
    //   const cursor = shoeCollection.find({});
    //   const shoes = await cursor.toArray();
    //   res.json(shoes);
    // });
    // // get single product
    // app.get("/shoes/:id", async (req, res) => {
    //   const id = req.params.id;

    //   const shoe = await shoeCollection.findOne({ _id: new ObjectId(id) });
    //   res.json(shoe);
    // });
    // app.patch("/shoes/:id", verifyToken, async (req, res) => {
    //   const id = req.params.id;
    //   const updatedShoe = req.body;
    //   const { _id, ...restUpdate } = updatedShoe;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: restUpdate,
    //   };
    //   const result = await shoeCollection.updateOne(filter, updateDoc, options);
    //   res.json(result);
    // });
    // app.delete("/shoes/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const result = await shoeCollection.deleteOne({ _id: new ObjectId(id) });
    //   res.json(result);
    // });
    // // user routes
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const token = createToken(user);
    //   const filter = { email: user.email };
    //   if (user.email === "") {
    //     res.status(400).send({ status: "Email  can not be empty" });
    //     return;
    //   }
    //   const existingUser = await userCollection.findOne(filter);
    //   if (existingUser) {
    //     res.status(400).send({ status: "Success Email already exists", token });
    //     return;
    //   }
    //   const result = await userCollection.insertOne(user);
    //   res.json({ token, status: "Success add user to" });
    // });
    // // get all users
    // app.get("/users", async (req, res) => {
    //   const cursor = userCollection.find({});
    //   const users = await cursor.toArray();
    //   res.json(users);
    // });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Route is working");
});

app.listen(port, () => {
  console.log(`Easy Bazaar Server is running on port ${port}`);
});
