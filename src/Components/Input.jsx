import  Form from 'react-bootstrap/Form'

function Input({label, type="text",name,placeholder="",register,autoComplete}){
    return(
        <>
            <Form.Group  controlId={name}>
                <Form.Label>{label}</Form.Label>
                <input type={type} autoComplete={autoComplete} placeholder={placeholder}className="input" {...register} />
            </Form.Group>  
        </>          
    )
}

export default Input;