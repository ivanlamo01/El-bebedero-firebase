import { Link } from "react-router-dom";
import {Card, Col, Button} from "react-bootstrap";
import { useAuthContext } from "../Context/AuthContext";

const style={
    titulo:{
        padding: "2px",
        color:"#202d56",
        fontSize: "32px",
        fontWeight: "700",
    },
    id:{
            color:"#f44c7f",
            fontSize: "20px",
            fontWeight: "500",
        },
    precio:{
        color:"#202d56",
        fontSize: "45px",
        fontWeight: "700",
    },
    precioBoton:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        
    },
    buttons:{
        height:"40px",
        marginTop:"20px",
        backgroundColor:"#202d56",
        margin:"10px"
    },
    botones:{
        display:"flex",
    },
    img:{
        height:"500px",
        width:"500px"
    },
    descripcion:{
        color:"#f44c7f",
        fontWeight:"700"
    },
    card:{
        borderRadius:"20px",
    }
    }

function Producto({id,title,price,thumbnail,description}) {
    const {login} = useAuthContext()
    return (
        
        <>  
                    <Col xs={12} sm={6} lg={4} xxl={3} style={{marginBottom:"10px",marginTop:"10px"}}>
                    <Card  style={style.card}>
                    <Card.Body>
                        <Card.Title style={style.titulo}>{title}</Card.Title>
                        <Card.Text style={style.id}>
                            {id} 
                        </Card.Text>
                        <Card.Text style={style.descripcion}>
                            {description} 
                        </Card.Text>
                    <span style={style.precioBoton}>
                        <Card.Text style={style.precio}>
                            ${price}
                        </Card.Text>
                    </span>
                    <div style={style.botones}>
                        <Button  className="boton" as={Link} to={`/detalle/${id}`} style={style.buttons}>Comprar</Button>
                    
                    {login&&(
                        <>
                            <Button  className="boton" as={Link} to={`/detalle/editar/${id}`} style={style.buttons}>Editar</Button>
                        </>
                    )}
                    </div>
                    </Card.Body>
                    </Card>
                </Col>
            
        </>
        );
    }

export default Producto ;