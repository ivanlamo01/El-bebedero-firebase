import  Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import Input from "../Components/Input";
import Container from  "react-bootstrap/Container";
import firebase from "../config/firebase"
import Alert from '../Components/Check';
import { useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { getByUserId } from "../Services/usuariosServices";
import {Button, Spinner } from "react-bootstrap";


const style={
    separador:{
        height: "500px",
        backgroundColor: "#FFAE00",
        display: "flex",
        justifyContent: "center",
        borderRadius:"20px"
    },
    h1:{
        color:"white",
        marginTop:"200px",
        fontSize:"60px",
        fontWeight:"900"
    },
    button:{
        width:"100%",
        height:"70px",
        backgroundColor:"#202d56"
    },
    buttonG:{
        width:"100%",
        height:"70px",
        backgroundColor:"orange"
    },    
    container: {
        maxWidth: "370px",
        marginTop: "50px",
        marginBottom: "50px",
        borderRadius: "30px",
        backgroundColor: "rgba(33, 33, 33, 255)",
        boxShadow: "0 4px 8px black",
        padding: "20px",
        color: "white"
      }
}

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({mode:"onChange"});
    const [alert,setAlert] = useState({variant:"",text:""})
    const[loading, setLoading] = useState(false)
    const {handleLogin} = useAuthContext()

    const onSubmit = async (data) =>{
        setLoading(true)
        try {
            const responseUser = await firebase
                .auth()
                .signInWithEmailAndPassword(data.email,data.password);
            if (responseUser.user.uid){
                const User = await getByUserId(responseUser.user.uid) ; 
                handleLogin(User.docs[0].data());
                setAlert({variant:"success", text: "¡Correcto!",duration: 3000,link:"/"});
                setLoading(false)
            }
            
        } catch (e) {
            console.log(e);
            setAlert({variant:"danger", text: "Error"});
            console.log(e);
            setLoading(false);
        } 
    };
    
    return (
        <>
            <div>
                <div style={style.separador}>
                    <h1 style={style.h1}>LOGIN</h1>
                </div>
                <Container style={style.container}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input label="E-mail" className="input"  type='email' autoComplete="username"  register={{...register("email", { required: true })}}/>
                        {errors.email && (
                            <div>
                                <span>This field is required</span>
                            </div>)}
                    <Input label="Contraseña" type="password" autoComplete="current-password" register={{...register("password", { required: true, minLength:6})}} className="input"/>
                        {errors.password && (
                            <div>
                                {errors.password?.type === "required" && <span>This field is required</span> }
                                {errors.password?.type === "minLength" && <span>*Debe tener al menos 6 caracteres</span> }
                            </div>)}
                        <Button   disabled={loading} style={style.button} type="submit">
                            {loading && <Spinner animation="border" size="sm"/>}
                            Iniciar
                        </Button>
                        {alert && <Alert {...alert} />}
                </Form>
                </Container>
            </div>
        </>
    );
}

export default Login;
