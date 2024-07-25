import back from "../Assets/img/background.png"
import ProductosCarousel from "./productosCarousel"

const style ={
    main:{
        width:"100%",
        height:"1080px",
        backgroundColor:"#FFAE00",
        display:"flex",
        justifyContent:"space-evenly" 
    },
    carousel:{
        width:"500px",
        marginTop:"200px",
    },
    text:{
        color:"white",
        marginTop:"300px",
        fontWeight:"1300",
    }
}


function Main() {
    return (
        <>
        <div style={style.main}>
            <div style={style.text}>
                    <h1 style={{fontWeight:"700",fontFamily:"'Visby CF',sansSerif",}}>
                    EL BEBEDERO
                    </h1>
                    <h1 style={{fontWeight:"700"}}>
                        Sistema Punto de Venta
                    </h1>
            </div>
            <div style={style.carousel}>
                <ProductosCarousel />
            </div>
        </div>
        </>
    );}

export default Main;