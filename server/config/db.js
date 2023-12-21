const mongoose = require("mongoose");

const connect = mongoose.connect(process.env.MONGOURI);

//connection object
const connection = mongoose.connection;

//method to verify connection
connection.on("connected", () => {
  console.log("db connected");
});

connection.on("error", (error) => {
  console.log("failed to connect db", error);
});

module.exports = mongoose
