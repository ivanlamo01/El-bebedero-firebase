import  Form from 'react-bootstrap/Form'

function InputRadio({label}){
    return(
        <>
            {['radio'].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                <Form.Check
                  label={label}
                  name="group1"
                  type={type}
                />
                
        </div>
      ))}       
        </>
    )
}

export default InputRadio;