const express = require("express");
const crypto = require("crypto");

const registerRoutes = express.Router();

const dbo = require("../db/conn");
const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

registerRoutes.route("/register").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb("users");
        const {username, password } = req.body;
        if(!passwordPolicy.test(password)){
            return res.status(400).json({error: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"});
        }

        const salt = crypto.randomBytes(16).toString('hex');
        let hash = function(str, salt){
            if(typeof(str) == 'string' && str.length > 0){
                let hash = crypto.createHmac('sha256', salt);
                let update = hash.update(str);
                let digest = update.digest('hex');
                return digest;
            }else{
                return false;
            }
        };
        const existingUser = await db_connect.collection("users").findOne({username});
        if(existingUser){
            return res.status(400).json({error:"there already exists an user with this name"});
        }
        let hashedPassword = hash(password, salt);

        let freshUser = {
            username: username,
            password: hashedPassword,
            salt: salt,
        }
        const result = await db_connect.collection("users").insertOne(freshUser);
        req.session.user = {
            username: username,
        }
        res.status(201).json({message: "User created successfully", userId: result.insertedId})
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

module.exports = registerRoutes;
