import Productos from "../Components/Productos"
import firebase from "../config/firebase";

function Home() {
    console.log(firebase);
    return (
        <>
            <Productos/>
        </>
    );
}

export default Home;
