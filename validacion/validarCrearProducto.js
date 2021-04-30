//Reglas de validacion
export default function validarCrearCuenta(valores) {
    let errores = {};

    //Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio";
    }

    //Validar el número de contacto
    if(!valores.contacto){
        errores.contacto = "El número de contacto es obligatorio";
    } else if(valores.contacto.length > 10){
        errores.contacto = "El contácto debe tener 10 números";
    }

    //validar el empresa
    if(!valores.empresa){
        errores.empresa = "El nombre de la empresa es obligatorio";
    }
    
    //Validar descripcion
    if(!valores.descripcion){
        errores.descripcion = "Agrega una descripcion al producto";
    }

    return errores;
}