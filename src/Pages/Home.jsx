import Productos from "../Components/Productos"
import firebase from "../config/firebase";
import Main from "../Components/main";

function Home() {
    console.log(firebase);
    return (
        <>
            <Main/>
            <Productos/>
        </>
    );
}

export default Home;
