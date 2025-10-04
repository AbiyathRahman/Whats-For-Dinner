const express = require("express");
const loginRoutes = express.Router();
const dbo = require("../db/conn");
const crypto = require("crypto");

loginRoutes.route("/login").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb("users");
        const {username, password} = req.body;
        let hash = (str, salt) => {
            if(typeof(str) == 'string' && str.length > 0){
                let hash = crypto.createHmac('sha256', salt);
                let update = hash.update(str);
                let digest = update.digest('hex');
                return digest;
            }else{
                return false;
            }
        }
        const user = await db_connect.collection("users").findOne({username});
        if(!user){
            return res.status(400).json({error: "User not found!"});
        }

        const hashedPassword = hash(password, user.salt);
        if(user.password !== hashedPassword){
            return res.status(400).json({error: "password is incorrect!"});
        }

        req.session.user = {
            username: user.username,
        };
        return res.status(200).json({message: "successfully logged in!"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Server Error"});
    }
});

module.exports = loginRoutes;