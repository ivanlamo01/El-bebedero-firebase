import React, { useState} from "react";
import Form from "react-bootstrap/Form"
import Input from "../Components/Input";
import Container from  "react-bootstrap/Container";
import Alert from '../Components/Check';
import InputRadio from "../Components/InputRadio"
import { useEffect } from "react";
import Button  from "react-bootstrap/Button"
import { getByProv} from "../Services/provinciasServices";

const style={
    separador:{
        height:"500px",
        backgroundColor:"#027fbb",
        display:"flex",
        justifyContent:"center"
    },
    h1:{
        color:"white",
        marginTop:"200px",
        fontSize:"60px",
        fontWeight:"900"
    },
    container:{
        maxWidth:"370px",
        marginTop:"50px",

    },
    button:{
        width:"100%",
        height:"70px",
        backgroundColor:"#202d56"
    },}

function PagDeCompra() {
    const [alert,setAlert] = useState({variant:"",text:""})
    const[loading, setLoading] = useState(false)
    const [provincias,setProvincias]= useState([])
    const comprar=()=> {
        return new Promise((resolve) => setTimeout(resolve, 2000));
    }
    
    useEffect(() => {
        const request = async () => {
        try {
            const response = await getByProv();
                console.log(response);
                setProvincias(response.provincias);
                
        } catch (e) {
            console.log(e);
        }
        };
        request();
    }, []);

    
    console.log("prov",provincias);

    useEffect(() => {
        if (loading) {
        comprar().then(() => {
            setLoading(false);
            setAlert({variant:"success", text: "¡Gracias por su compra!",duration: 3000,link:"/"})
        });
        }
    }, [loading]);

    const handleClick = () => setLoading(true);

    return (
            <>
            <div>
            <div style={style.separador}>
                    <h1 style={style.h1}>COMPRA</h1>
                </div>
                <Container style={style.container}>
                <Form  >
                        <div>
                            <p>Seleccione su Metodo de Pago</p>
                            <InputRadio label="Mercado Pago"/>
                            <InputRadio label="Tarjeta"/>
                            <InputRadio label="Pago Facil / Rapipago"/>
                        </div>
                        <p>Provincia</p>
                        <Form.Select  >
                            {provincias.map((prov) => (  
                                <option 
                                    value={prov.id} 
                                    key={prov.id} >
                                        {prov.nombre}
                            </option>
                            ))}
                        </Form.Select>
                        <Input label="Ciudad"  />
                        <Input label="Direccion"   />
                        <Button
                        style={style.button}
                            variant="primary" 
                            type="submit" 
                            disabled={loading} 
                            onClick={!loading ? handleClick : null}>
                                {loading ? 'Loading…' : ' Comprar'}
                        </Button>
                        {alert && <Alert {...alert} />}
                </Form>
                </Container>
            </div>
            </>
        
    );
}



export default PagDeCompra;