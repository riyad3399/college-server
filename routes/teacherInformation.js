const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const router = express.Router();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xiw11k9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//  collection
const teacherInformationCollection = client
  .db("cda-college")
  .collection("teacherInfo");



router.put("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;

    const query = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await teacherInformationCollection.updateOne(
      query,
      updateDoc,
      options
    );
    res.json({
      success: true,
      message: "teacher information created successful",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await teacherInformationCollection.find().toArray();
    res.json({
      success: true,
      message: "Get all teachers information successful",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const result = await teacherInformationCollection.findOne(query);
    res.json({
      success: true,
      message: "Get single teacher information successful",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});





module.exports = router;
