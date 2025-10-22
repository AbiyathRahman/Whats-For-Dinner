import { useState, useEffect } from 'react';
import './Restaurant.css';

const Restaurant = (props) => {
    const [isFavorite, setIsFavorite] = useState(props.isFavorited || false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsFavorite(props.isFavorited || false);
    }, [props.isFavorited]);

    const toggleFavorite = (e) => {
        e.stopPropagation();
        if (!isFavorite) {
            setIsFavorite(true);
            setIsAnimating(true);
            
            // Remove animation class after animation completes
            setTimeout(() => setIsAnimating(false), 300);
            props.addFavorite(props.name);
        } else {
            setIsFavorite(false);
            props.deleteFavorite(props.name);
        }
        // Call the original onClick handler if it exists
        if (props.onFavoriteToggle) {
            props.onFavoriteToggle(!isFavorite);
        }
    };

    return (
        <article className="wfd-restaurant-card">
            <div className="wfd-restaurant-body">
                <h4 className="wfd-restaurant-name">{props.name || 'Unnamed'}</h4>
                <p className="wfd-restaurant-cuisine">{props.cuisine || 'Unknown'}</p>
            </div>
            <div className="wfd-restaurant-meta">
                <span className="wfd-rating">{props.rating ?? 'N/A'}</span>
                <button 
                    className={`wfd-favorite-btn ${isFavorite ? 'favorited' : ''} ${isAnimating ? 'animate' : ''}`}
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
        </article>
    );
};

export default Restaurant;