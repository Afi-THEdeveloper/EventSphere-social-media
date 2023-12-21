const express = require("express");
const app = express();
const multer  = require('multer')
const helmet = require('helmet')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// to use (.env file access)
require("dotenv").config();
const dbConfig = require("./config/db");



const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public/assets')))
// to destructure json type data from user as request
app.use(express.json());




//routes configuration ( when ever this kind of end points come it will search in specific routes)
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);
const eventRoutes = require("./routes/EventsRoutes");
app.use("/api/event", eventRoutes);
const adminRoutes = require("./routes/AdminRoutes");
app.use("/api/admin", adminRoutes);





const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log("server running");
}); 



