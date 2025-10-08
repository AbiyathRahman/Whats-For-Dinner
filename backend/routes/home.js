const express = require("express"); 
const homeRoutes = express.Router();
const dbo = require("../db/conn");
const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const restaurants = [
        { id: 1, name: "The Gourmet Kitchen", cuisine: "Italian", rating: 4.5 },
        { id: 2, name: "Sushi World", cuisine: "Japanese", rating: 4.7 },
        { id: 3, name: "La Pizzeria", cuisine: "Italian", rating: 4.3 },
        { id: 4, name: "The Grill Shack", cuisine: "American", rating: 4.2 },
    ];
const checkUserLogIn = (req, res, next) => {
    if(!req.session.user){
        return res.status(401).json({error: "User not logged in!"});
    }
    next();
};
// Home route
homeRoutes.route("/").get(checkUserLogIn, (req, res) => {
    res.json({
        username: req.session.user.username,
    });
});
// Get All Restaurants
homeRoutes.route("/restaurants").get(checkUserLogIn, async (req, res) => {
    const db_connect = dbo.getDb("DinnerDecider");
    const allRestaurants = await db_connect.collection("restaurants").find({}).toArray();
    res.json(allRestaurants.map(({name, cuisine, rating}) => ({name, cuisine, rating})));
    
});
// Get Random Restaurant
homeRoutes.route("/random-restaurant").get(checkUserLogIn, (req, res) => {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    res.json(restaurants[randomIndex].name);
});
// Add Restaurant
homeRoutes.route("/add-restaurant").post(checkUserLogIn, async (req, res) => {
    try{
        const db_connect = dbo.getDb("DinnerDecider");
        const { name, cuisine, rating} = req.body;
        if(!name || !cuisine || !rating){
            return res.status(400).json({error: "Please provide name, cuisine, and rating of the restaurant."});
        };
        
        const newRestaurant = {
        id: restaurants.length + 1,
        name,
        cuisine,
        rating,
        addedBy: req.session.user.username};
        const existingRestaurant = await db_connect.collection("restaurants").findOne({name});
        if(existingRestaurant){
            return res.status(400).json({error: "Restaurant with this name already exists."});
        }
        await db_connect.collection("restaurants").insertOne(newRestaurant);
        restaurants.push(newRestaurant);
        res.status(201).json({message: "Restaurant added successfully!", restaurant: newRestaurant});
    }
    catch(err){
        res.status(500).json({error: "Internal Server Error", err});
    }
   
});
// Get Nearby Restaurants using Google Places API
homeRoutes.route("/nearby-restaurants").get(checkUserLogIn, async (req, res) => {
    const { lat, lng, filter } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: "Please provide latitude and longitude." });
    }

    // Basic numeric validation
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        return res.status(400).json({ error: "Latitude and longitude must be valid numbers." });
    }

    if (!GOOGLE_API_KEY) {
        console.warn("GOOGLE_API_KEY is not set. Check config.env and dotenv.");
        return res.status(500).json({ error: "Server configuration error: missing Google API key." });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${latNum},${lngNum}`,
                radius: 2000, // 2km radius
                type: "restaurant",
                key: GOOGLE_API_KEY,
            },
        });

        // Inspect the API-level status to provide a clearer message
        const apiStatus = response.data.status; // e.g., OK, ZERO_RESULTS, REQUEST_DENIED
        if (apiStatus !== 'OK') {
            // For ZERO_RESULTS, return an empty array but include the status so the client can display a message
            if (apiStatus === 'ZERO_RESULTS') {
                return res.json({ status: apiStatus, results: [] });
            }

            // For other statuses, include the error_message returned by Google if present
            const errorMessage = response.data.error_message || 'Unknown error from Google Places API';
            console.error('Google Places API error:', apiStatus, errorMessage);
            return res.status(502).json({ error: 'Google Places API error', status: apiStatus, message: errorMessage });
        }

        // Map the places to a smaller payload
        const places = response.data.results.map(place => ({
            name: place.name,
            rating: place.rating,
            address: place.vicinity || place.formatted_address,
            type: place.types
        }));
        if(filter){
            const filterLower = filter.toLowerCase();
            const filteredPlaces = places.filter(place => {
                return place.name.toLowerCase().includes(filterLower) || place.type.some(type => type.toLowerCase().includes(filterLower));
            });
            return res.json(filteredPlaces);
        }

        res.json(places);
    } catch (err) {
        // Axios/network or other unexpected error
        console.error('Error fetching nearby restaurants:', err && err.message ? err.message : err);
        if (err.response && err.response.data) {
            return res.status(502).json({ error: 'Failed to fetch nearby restaurants', details: err.response.data });
        }
        res.status(500).json({ error: 'Failed to fetch nearby restaurants', details: err.message || err });
    }
});

module.exports = homeRoutes;