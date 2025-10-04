const express = require("express");
require("dotenv").config({path: "./config.env"});
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const port = process.env.PORT || 4000;
const dbo = require("./db/conn");
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI
    })
}));
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
app.use(express.json());
app.use("/", registerRoutes);
app.use("/", loginRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    dbo.connectToServer(function(err){
        if(err){
            console.log(err);
        }
    });
    console.log(`Server is running on port ${port}`);
});
