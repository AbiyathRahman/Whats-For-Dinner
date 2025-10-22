import Header from "./Header"
import './Home.css';
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RestaurantList from "./RestaurantList";
import CategoryList from "./CategoryList";


const foodCategories = [
    "burgers", "pizza", "sandwiches", "mexican", "asian", "all"
    ]
const Home = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [coords, setCoords] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {
        // Wrap geolocation in a promise so we can await it
        function getCurrentPositionAsync(options = {}){
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    return reject(new Error('Geolocation not supported'));
                }
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (err) => reject(err),
                    options
                );
            });
        }

        

        async function init(){
            try{
                // Check auth first
                const response = await fetch("http://localhost:4000/home",{
                    method: "GET",
                    credentials: "include",
                });
                if(!response.ok){
                    const errorData = await response.json();
                    window.alert(errorData.error || "You are not logged in");
                    navigate("/login");
                    return;
                }
                const data = await response.json();
                setUsername(data.username);

                // Then get location and fetch nearby restaurants
                try{
                    const position = await getCurrentPositionAsync({enableHighAccuracy: true, timeout: 10000});
                    const lat = parseFloat(position.coords.latitude);
                    const lng = parseFloat(position.coords.longitude);
                    console.log("Latitude: " + lat + ", Longitude: " + lng);
                    setCoords({lat, lng});
                    // await fetchNearByRestaurants(lat, lng);
                }catch(locErr){
                    console.error('Geolocation error:', locErr);
                    window.alert('Error: Unable to get user location');
                }

            }catch(err){
                console.error('Init error:', err);
                if(err.response && err.response.data){
                    window.alert(err.response.data.error || "You are not logged in");
                    navigate("/login");
                }else{
                    window.alert("Error: " + (err.message || err));
                    navigate("/login");
                }
            }
        }

        init();
    },[navigate]);
    const handleLogout = async () =>{
        try{
            const response = await fetch("http://localhost:4000/logout",{
                method: "POST",
                credentials: "include",

            });
            if(!response.ok){
                const errorData = await response.json();
                window.alert(errorData.error || "Logout Failed");
                return;
            }else{
                navigate("/login");
            };
            
        }catch(err){
            window.alert("Error: " + err.message);
            return;
        }
    };

    async function fetchNearByRestaurants(lat, lng){
            try{
                // fixed URL (was missing //)
                const response = await fetch(`http://localhost:4000/home/nearby-restaurants?lat=${lat}&lng=${lng}`,{
                    method: "GET",
                    credentials: "include",
                });
                if(!response.ok){
                    const errorData = await response.json();
                    window.alert(errorData.error || "Failed to fetch nearby restaurants");
                    return;
                }
                const data = await response.json();
                // backend may return { status, results } or a plain array
                if (data && data.results) {
                    setRestaurants(data.results);
                } else {
                    setRestaurants(data);
                }

            }catch(err){
                window.alert("Error: " + (err.message || err));
                return;
            }
        };
    const fetchRandomRestaurant = async () => {
        const length = restaurants.length;
        if(length === 0){
            window.alert("No restaurants available to choose from. Please select a category first.");
            return;
        }
        const randomIndex = Math.floor(Math.random() * length);
        const randomRestaurant = restaurants[randomIndex];
        setRestaurants([randomRestaurant]);
    }
    const fetchRestaurantByCategory = async (category) => {
        if(!coords){
            window.alert("Location not available! Refresh the page or allow location access.");
            return;
        }
        try{
            const response = await fetch(`http://localhost:4000/home/nearby-restaurants?lat=${coords.lat}&lng=${coords.lng}&filter=${encodeURIComponent(category)}`,{
                method: "GET",
                credentials: "include",
            });
            if(!response.ok){
                const errorData = await response.json();
                window.alert(errorData.error || "Failed to fetch restaurants for category: " + category);
                return;
            }
            const data = await response.json();
            if(data.status === 'ZERO_RESULTS'){
                window.alert("No restaurants found for category: " + category);
                setRestaurants([]);
                return;
            }else{
                setRestaurants(data);
            }
            

        }catch(err){
        window.alert("Error: " + (err.message || err));
        return;
        };
    };
    const handleCategoryClick = (category) => {
        console.log("Category clicked: " + category);
        setSelectedCategory(category);
        if(category === 'all'){
            if(coords){
                fetchNearByRestaurants(coords.lat, coords.lng);
            } else {
                window.alert('Location not available to fetch all restaurants');
            }
            return;
        }

        // For specific categories, fetch filtered restaurants
        fetchRestaurantByCategory(category);
    };
    const addFavorite = async (restaurantName) => {
        try{
            const response = await fetch("http://localhost:4000/home/favorites",{
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: restaurantName}),
            
            });
            if(!response.ok){
                const errorData = await response.json();
                window.alert(errorData.error || "Failed to add favorite");
                return;
            }
            const data = await response.json();
            console.log(data);
            window.alert(`Added ${restaurantName} to favorites!`);
        }catch(err){
            window.alert("Error: " + (err.message || err));
            return;
        }
    }
    
    return(
        <div className="wfd-home-page">
            <Header username={username} onLogout={handleLogout}/>

            <main className="wfd-main">
                <section className="wfd-intro">
                    <h2 className="wfd-page-title">Welcome back{username ? `, ${username}` : ''}!</h2>
                    <p className="wfd-subtitle">What are you craving today?</p>
                </section>
                <section>
                    <h3 className="wfd-section-title">Food Categories</h3>
                    <CategoryList categories={foodCategories} onCategoryClick={handleCategoryClick} onRandomClick={fetchRandomRestaurant}/>
                </section>
                <section className="wfd-restaurants">
                    <h3 className="wfd-section-title">Found You Some Restaurants!</h3>
                    <RestaurantList restaurants={restaurants} addFavorite={addFavorite}/> 
                </section>
            </main>
        </div>
    )
};
export default Home;