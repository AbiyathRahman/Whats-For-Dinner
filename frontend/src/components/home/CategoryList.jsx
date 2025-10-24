import Card from "../UI/Card";
import './CategoryList.css'

const CategoryList = (props) => {
    const onClickHandler = (category) => {
        props.onCategoryClick(category);
    }
    const onRandomClickHandler = () => {
        props.onRandomClick();
    }
    const onFavoritesClickHandler = () => {
        props.onFavoriteClick();
    }

    // Category icons mapping
    const categoryIcons = {
        'burgers': '🍔',
        'pizza': '🍕',
        'sandwiches': '🥪',
        'mexican': '🌮',
        'asian': '🍜',
        'all': '🍚',
        
    };

    return (
        <div className="wfd-category-list">
            <div className="wfd-category-grid">
                {props.categories.map((category, idx) => (
                    <div className="wfd-category-item" key={idx}>
                        <Card>
                            <div 
                                className="wfd-category-card" 
                                onClick={() => onClickHandler(category)}
                            >
                                <div className="wfd-category-icon">
                                    {categoryIcons[category] || '🍽️'}
                                </div>
                                <div className="wfd-category-content">
                                    <h4 className="wfd-category-name">{category}</h4>
                                    <p className="wfd-category-subtitle">Explore {category} restaurants</p>
                                </div>
                                <div className="wfd-category-arrow">→</div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="wfd-special-buttons-grid">
                <div className="wfd-category-item">
                    <Card>
                        <div className="wfd-category-card" onClick={onRandomClickHandler}>
                            <div className="wfd-category-icon">
                                🎲
                            </div>
                            <div className="wfd-category-content">
                                <h4 className="wfd-category-name">Random Restaurants</h4>
                                <p className="wfd-category-subtitle">Find a random place</p>
                            </div>
                            <div className="wfd-category-arrow">→</div>
                        </div>
                    </Card>
                </div>
                <div className="wfd-category-item">
                    <Card>
                        <div className="wfd-category-card" onClick={onFavoritesClickHandler}>
                            <div className="wfd-category-icon">
                                ❤️
                            </div>
                            <div className="wfd-category-content">
                                <h4 className="wfd-category-name">Favorites</h4>
                                <p className="wfd-category-subtitle">Your saved places</p>
                            </div>
                            <div className="wfd-category-arrow">→</div>
                        </div>
                    </Card>
                </div>
                <div className="wfd-category-item">
                    <Card>
                        <div className="wfd-category-card" onClick={props.onDeciderClick}>
                            <div className="wfd-category-icon">
                                🎯
                            </div>
                            <div className="wfd-category-content">
                                <h4 className="wfd-category-name">Decider</h4>
                                <p className="wfd-category-subtitle">Help me choose</p>
                            </div>
                            <div className="wfd-category-arrow">→</div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
export default CategoryList;