import Header from "./Header"
import './Home.css';
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RestaurantList from "./RestaurantList";
const Home = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([{name: "", cuisine: "", rating: ""}]);
    const [coords, setCoords] = useState(null);

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
                    await fetchNearByRestaurants(lat, lng);
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
    }
    return(
        <div className="wfd-home-page">
            <Header username={username} onLogout={handleLogout}/>

            <main className="wfd-main">
                <section className="wfd-intro">
                    <h2 className="wfd-page-title">Welcome back{username ? `, ${username}` : ''}!</h2>
                    <p className="wfd-subtitle">Find nearby restaurants quickly and easily.</p>
                </section>

                <section className="wfd-restaurants">
                    <h3 className="wfd-section-title">Nearby Restaurants</h3>
                    <RestaurantList restaurants={restaurants}/>
                </section>
            </main>
        </div>
    )
};
export default Home;