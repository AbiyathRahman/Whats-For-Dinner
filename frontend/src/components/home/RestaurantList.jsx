import Restaurant from "./Restaurant"
import './RestaurantList.css'

const RestaurantList = (props) => {
    const list = Array.isArray(props.restaurants) ? props.restaurants : [];
    return(
        <div className="wfd-restaurant-list">
            {list.length > 0 ? (
                <div className="wfd-grid">
                    {list.map((restaurant, idx) => {
                        const cuisine = Array.isArray(restaurant.type) && restaurant.type.length > 0 ? restaurant.type[0].replaceAll('_',' ') : (restaurant.cuisine || 'Unknown');
                        return (
                            <div className="wfd-grid-item" key={restaurant.place_id || restaurant.id || restaurant.name || idx}>
                                <Restaurant name={restaurant.name} cuisine={cuisine} rating={restaurant.rating} />
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