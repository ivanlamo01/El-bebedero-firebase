import  Form from 'react-bootstrap/Form'

function Input({label, type="text",name,placeholder="",register,autoComplete}){
    return(
        <>
            <Form.Group className="mb-3" controlId={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Control type={type} autoComplete={autoComplete} placeholder={placeholder} {...register} />
            </Form.Group>  
        </>          
    )
}

export default Input;