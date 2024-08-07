
import  Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import Input from "../Components/Input";
import Container from "react-bootstrap/Container";
import { create } from "../Services/productosServices";
import { useState } from "react";
import Check from '../Components/Check';
import { Spinner } from "react-bootstrap";
import "../styles/prodAlta.css"

const style={
  separador:{
      height:"500px",
      backgroundColor:"#FFAE00",
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
    marginBottom:"50px",
    borderRadius:"30px",
    backgroundColor:"rgba(33, 33, 33, 255)",
    boxShadow: " 0 4px 8px black",
    padding:"20px",
    color:"white"
},

}
function ProductosAlta() {
  
  const { register, handleSubmit, formState: { errors } } = useForm({mode:"onChange"});
  const [alert,setAlert] = useState({variant:"",text:""})
  const[loading, setLoading] = useState(false)
  const onSubmit = async (data) =>{
    console.log(data);
    setLoading(true)
    try {
      const document = await create(data);
          if (document){
            setAlert({variant:"success", text: "¡Exitoso!",duration: 1500});
            setLoading(false)
            window.location.reload(false)
        }  
    } catch (e) {
        console.log(e);
        setAlert({variant:"danger", text: "Error"});
        setLoading(false);
    }
  };

  return (
    <div>
        <div style={style.separador}>
          <h1 style={style.h1}>AGREGAR PRODUCTO</h1>
        </div>
      <Container style={style.container}>
      <Form onSubmit={handleSubmit(onSubmit)}>
            <Input label="Precio" register={{...register("price", { required: true })}}/>
                {errors.nombre && (
                <div>
                    <span>This field is required</span>
                </div>)}
            <Input label="Titulo" register={{...register("title", { required: true })}}  className="input"/>
              {errors.apellido && (
                <div>
                    <span>This field is required</span>
                </div>)}
            <Input label="Categoria"   register={{...register("category", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}
                <Input label="Codigo de baras" type="number"   register={{...register("Barcode", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}
                <Input label="Stock"   register={{...register("stock", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}

          <button type="submit" loading={loading} className="boton">
          {loading && <Spinner animation="border" size="sm"/>}
            Guardar
          </button>
          {alert && <Check {...alert} />}
        </Form>
        </Container>
    </div>
  );
}

export default ProductosAlta;
