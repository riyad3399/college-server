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
const studentInformationCollection = client
  .db("cda-college")
  .collection("studentInfo");

async function generateStudentID() {
  const lastStudent = await studentInformationCollection.findOne(
    {},
    { sort: { studentID: -1 } }
  );

  if (!lastStudent) {
    return "AAC1001";
  }

  const newID = incrementID(lastStudent.studentID);
  return newID;
}

function incrementID(lastID) {
  const numericPart = parseInt(lastID.slice(3));
  const newNumericPart = numericPart + 1;
  const paddedNumericPart = String(newNumericPart).padStart(4, "0");
  const studentID = `AAC${paddedNumericPart}`;
  return studentID;
}

router.put("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;

    if (!user.studentID) {
      user.studentID = await generateStudentID();
    }

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
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await studentInformationCollection.find().toArray();
    res.json({
      success: true,
      message: "Get all students information successful",
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
    const result = await studentInformationCollection.findOne(query);
    res.json({
      success: true,
      message: "Get single student information successful",
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
