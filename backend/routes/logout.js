const express = require("express");
const logoutRoutes = express.Router();

logoutRoutes.route("/logout").post((req, res) => {
    try{
        req.session.destroy((err) => {
            if(err){
                console.error(err);
                return res.status(500).json({error: "Server Error"});
            }
            return res.status(200).json({message: "Successfully logged out!"});
        });
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Server Error"});
    }
});

module.exports = logoutRoutes;