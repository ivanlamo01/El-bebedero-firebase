import firebase from "../config/firebase";
import Main from "../Components/main";

function Home() {
    console.log(firebase);
    return (
        <>
            <Main/>
        </>
    );
}

export default Home;
