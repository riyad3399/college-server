const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const router = express.Router();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xiw11k9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//  collection
const userCollection = client.db("cda-college").collection("users");

router.put("/:email", async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  const query = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await userCollection.updateOne(query, updateDoc, options);
  res.json({
    success: true,
    message: "user created successful",
    data: result,
  });
});

router.get("/", async (req, res) => {
  const result = await userCollection.find().toArray();
  res.json({
    success: true,
    message: "All users data get successful",
    data: result,
  });
});

module.exports = router;
