const { MongoClient } = require("mongodb");

let db = null;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  await client.connect();
  db = client.db(process.env.DB_NAME || "interview_ai");
  console.log("✅ Connected to MongoDB");
  return db;
}

async function saveAnalysis(userId, data) {
  const database = await connectDB();
  const collection = database.collection("analyses");
  const doc = {
    userId,
    ...data,
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return result.insertedId;
}

async function getUserAnalyses(userId) {
  const database = await connectDB();
  const collection = database.collection("analyses");
  return collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
}

async function getAnalysisById(id) {
  const { ObjectId } = require("mongodb");
  const database = await connectDB();
  const collection = database.collection("analyses");
  return collection.findOne({ _id: new ObjectId(id) });
}

module.exports = { connectDB, saveAnalysis, getUserAnalyses, getAnalysisById };
