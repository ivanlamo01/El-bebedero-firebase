import  Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import Input from "../Components/Input";
import {Container } from "react-bootstrap";
import firebase from "../config/firebase"
import Check from '../Components/Check';
import { useState } from "react";
import ButtonWhitLoading from "../Components/buttonWhitLoading"


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
    marginTop:"50px"
},
  button:{
    width:"100%",
    height:"70px",
    backgroundColor:"#202d56"
  },
}



function Registro() {
  
  const { register, handleSubmit, formState: { errors } } = useForm({mode:"onChange"});
  const [alert,setAlert] = useState({variant:"",text:""})
  const[loading, setLoading] = useState(false)

  const onSubmit = async (data) =>{
    setLoading(true)
    console.log(data);
    try {
      const responseUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
        console.log(responseUser);
        if(responseUser.user.uid){
          const document = firebase.firestore().collection("Usuarios")
          .add({
            nombre:data.nombre,
            apellido:data.apellido,
            userId:responseUser.user.uid
            });console.log(document);
          if (document){
            setAlert({variant:"success", text: "¡Registro Exitoso!",duration: 3000, link:"/ingresar"});
            setLoading(false)
        }
      }  
    } catch (e) {
        setAlert({variant:"danger", text: "Error"});
        console.log(e);
        setLoading(false);
    }
  };

  return (
    <div>
      <div style={style.separador}>
          <h1 style={style.h1}>BIENVENIDO/A!</h1>
      </div>
      <Container style={style.container}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Nombre" register={{...register("nombre", { required: true })}}/>
            {errors.nombre && (
              <div>
                  <span>This field is required</span>
              </div>)}
          <Input label="Apellido" register={{...register("apellido", { required: true })}}  />
            {errors.apellido && (
              <div>
                  <span>This field is required</span>
              </div>)}
          <Input label="E-mail"  type='email' autoComplete="newUsername" register={{...register("email", { required: true })}} />
            {errors.email && (
              <div>
                  <span>This field is required</span>
              </div>)}
          <Input label="Contraseña" type="password" autoComplete="newPassword"  register={{...register("password", { required: true, minLength:6})}} />
            {errors.password && (
              <div>
                {errors.password?.type === "required" && <span>This field is required</span> }
                {errors.password?.type === "minLength" && <span>*Debe tener al menos 6 caracteres</span> }
              </div>)}
          <ButtonWhitLoading variant="primary" type="submit" loading={loading} style={style.button}>
            Registrarse
          </ButtonWhitLoading>
          {alert && <Check {...alert} />}
        </Form>
      </Container>
    </div>
  );
}

export default Registro;
