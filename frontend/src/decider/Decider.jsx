import Button from '../components/UI/Button';
const Decider = () => {
    const handleClick = async () => {
        console.log("Deciding...")
    }
    return (
        <div>
            <Button onClick={handleClick}>Decide For Me!</Button>
        </div>
    )
};
export default Decider;