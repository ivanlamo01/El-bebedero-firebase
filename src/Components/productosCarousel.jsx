import Carousel from "react-bootstrap/Carousel"
import { useState,useEffect } from "react";
import { getCarousel } from "../Services/productosServices";

const style ={
    carousel:{
        width:"500px",
        height:"500px",
    },
}

function ProductosCarousel() {
    const [index,setIndex] = useState(0);
    const handleSelect=(selectedIndex,e)=>{
        setIndex(selectedIndex)
}
    const [carouselImg, setCarouselImg] = useState([])
    
    const [isHover, setIsHover] = useState(false);
    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    useEffect(() => {
    const request = async () => {
        try {
            const response = await getCarousel();
                console.log(response);
                setCarouselImg(response);
        } catch (e) {
            console.log(e);
        }
        };
    request();
}, []);

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} style={style.carousel}>
            {carouselImg.map((element)=>( 
            <Carousel.Item key={element.id} style={{opacity: isHover? "0.5":"1", transition: "opacity 1s"}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img 
                    className="d-block w-100" 
                    src={element.data().thumbnail} 
                    alt="First slide"
                    width="500px"
                    height="500px"
                />
            </Carousel.Item>
                ))}
        </Carousel>
    );}

export default ProductosCarousel;