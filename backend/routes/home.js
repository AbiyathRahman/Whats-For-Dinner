const express = require("express"); 
const homeRoutes = express.Router();
const checkUserLogIn = (req, res, next) => {
    if(!req.session.user){
        return res.status(401).json({error: "User not logged in!"});
    }
    next();
};

homeRoutes.route("/home").get(checkUserLogIn, (req, res) => {
    res.json({
        username: req.session.user.username,
        message: "Welcome to the home page!"
    });
});
module.exports = homeRoutes;