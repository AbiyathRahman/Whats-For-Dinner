import Restaurant from "./Restaurant"
import './RestaurantList.css'
import Card from '../UI/Card';

const RestaurantList = (props) => {
    const listOfRestaurants = Array.isArray(props.restaurants) ? props.restaurants : [];

    // Deduplicate by place_id when available, otherwise by normalized name
    const dedupeRestaurants = (() => {
        const seen = new Map();
        for (const r of listOfRestaurants) {
            const key = (r && r.place_id) ? `id:${r.place_id}` : `name:${(r && r.name) ? r.name.trim().toLowerCase() : ''}`;
            if (!seen.has(key)) {
                seen.set(key, r);
            }
        }
        return Array.from(seen.values());
    })();

    return(
        <div className="wfd-restaurant-list">
            {dedupeRestaurants.length > 0 ? (
                <div className="wfd-grid">
                    {dedupeRestaurants.map((restaurant, idx) => {
                        const cuisine = Array.isArray(restaurant.type) && restaurant.type.length > 0 ? restaurant.type[0].replaceAll('_',' ') : (restaurant.cuisine || 'Unknown');
                        const key = restaurant.place_id || restaurant.id || restaurant.name || idx;
                        return (
                            <div className="wfd-grid-item" key={key}>
                               <Card><Restaurant name={restaurant.name} cuisine={cuisine} rating={restaurant.rating} addFavorite={props.addFavorite} deleteFavorite={props.deleteFavorite} isFavorited={props.favorites?.some(fav => fav.name === restaurant.name)} /></Card>
                                
                            </div>
                            
                        )
                    })}
                    
                </div>
            ) : (
                <div className="wfd-empty">No restaurants found nearby.</div>
            )}
        </div>
    );
};
export default RestaurantList;