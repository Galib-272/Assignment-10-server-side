const { betterAuth } = require("better-auth");
const { MongoClient } = require("mongodb");

// 1. Instantiate a dedicated MongoClient instance just for Better-Auth sessions
const client = new MongoClient(process.env.MONGO_URI);

const auth = betterAuth({
  database: {
    provider: "mongodb",
    db: client.db("ticketbari") // Explicitly targets your 'ticketbari' collection folder name
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
    },
  },
});

module.exports = auth;