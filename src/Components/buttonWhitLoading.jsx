import {Button, Spinner } from "react-bootstrap"

function ButtonWhitLoading({variant="primary",type="submit",loading,children}){
    return(
        <Button type={type} variant={variant} disabled={loading}>
            {loading && <Spinner animation="border" size="sm"/>}
            {children}
        </Button>
    )
}

export default ButtonWhitLoading;