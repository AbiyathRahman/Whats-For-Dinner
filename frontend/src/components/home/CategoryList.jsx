import Card from "../ui/Card";
import './CategoryList.css'
const CategoryList = (props) => {
    const onClickHandler = (category) => {
        props.onCategoryClick(category);
    }
    return (
        <div className="wfd-category-list">
            <div className="wfd-grid">
                {props.categories.map((category, idx) => (
                    <div className="wfd-category-item" key={idx}>
                        <Card>
                            <ul className="wfd-category-name" onClick={() => onClickHandler(category)}>{category}</ul>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default CategoryList;