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
const studentInformationCollection = client
  .db("cda-college")
  .collection("studentInfo");

// create student id

async function generateStudentID() {
  const lastStudent = await studentInformationCollection
    .findOne()
    .sort({ studentID: -1 });
    const newID = lastStudent ? incrementID(lastStudent.studentID) : "AAC1001";
    return newID;
}

function incrementID(lastID) {
  const numericPart = parseInt(lastID.slice(1));
  const newNumericPart = numericPart + 1;
  return `AAC${newNumericPart}`;
}

router.put("/:email", async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  const query = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await studentInformationCollection.updateOne(
    query,
    updateDoc,
    options
  );
  res.json({
    success: true,
    message: "student information created successful",
    data: result,
  });
});

module.exports = router;
