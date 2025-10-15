import './Restaurant.css'
import Button from '../UI/Button';
const Restaurant = (props) => {
    return(
        <article className="wfd-restaurant-card">
            <div className="wfd-restaurant-body">
                <h4 className="wfd-restaurant-name">{props.name || 'Unnamed'}</h4>
                <p className="wfd-restaurant-cuisine">{props.cuisine || 'Unknown'}</p>
            </div>
            <div className="wfd-restaurant-meta">
                <span className="wfd-rating">{props.rating ?? 'N/A'}</span>
            </div>
            <Button className="wfd-rating" onClick={props.onAdd}>Add</Button>
        </article>
    )
};
export default Restaurant;