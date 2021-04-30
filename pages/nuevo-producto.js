import React , {useState, useContext} from 'react'; 
import { css } from '@emotion/react';
import Router, {useRouter} from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/InterfazUsuario/Formulario';

import {FirebaseContext} from '../firebase';

import Error404 from '../components/layout/404';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';


const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  contacto: '',
  imagen: '',
  descripcion: ''
}

const NuevoProducto = () => {
  //State de las imagenes
  const [urlimagen, guardarUrlImagen] = useState('');
  

  const [ error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChange } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, contacto,  descripcion } = valores;

  //Hook de router para redireccionar
  const router = useRouter();
  
  //Contex con las operaciones crud de firebase
  const {usuario, firebase} = useContext(FirebaseContext);


  async function crearProducto() {
  
    //Si el usuario no esta logeado, llevar al login
    if(!usuario){
      return router.push('/login');
    }
    //Crear el objeto de nuevo producto
    const producto = {
      nombre, 
      empresa,
      contacto, 
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
  }
    //Insertar producto en la base de datos
    firebase.db.collection('productos').add(producto);
    return router.push('/');
  }
  
  //Funciones imagen
  const onChanche = (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage.ref("productos");
    const fileRef = storageRef.child(file.name);
    fileRef.put(file).then(() => {
        firebase
        .storage
        .ref("productos")
        .child(file.name)
        .getDownloadURL()
        .then(url => {
          guardarUrlImagen(url);
        } );
    });
    
  };

  return (
    <div>
      <Layout>
        { !usuario ? <Error404 /> : (
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Agregar nuevo producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset>
                  <legend>Información general</legend>
                  <Campo>
                      <label htmlFor="nombre">Nombre</label>
                      <input 
                          type="text"
                          id="nombre"
                          placeholder="Nombre producto"
                          name="nombre"
                          value={nombre}
                          onChange={handleChange}
                      />
                  </Campo>

                  {errores.nombre && <Error>{errores.nombre}</Error> }
      
                  <Campo>
                      <label htmlFor="empresa">Empresa</label>
                      <input 
                          type="text"
                          id="empresa"
                          placeholder="Nombre Empresa"
                          name="empresa"
                          value={empresa}
                          onChange={handleChange}
                      />
                  </Campo>

                      {errores.empresa && <Error>{errores.empresa}</Error> }

                  <Campo>
                        <label htmlFor="contacto">Contácto</label>
                        <input 
                            type="number"
                            id="contacto"
                            placeholder="Número de Contacto"
                            name="contacto"
                            value={contacto}
                            onChange={handleChange}
                        />
                  </Campo>

                      {errores.contacto && <Error>{errores.contacto}</Error> }    

                   <Campo>
                      <label htmlFor="imagen">Imagen</label>
                     <input 
                        type="file"
                        onChange={onChanche}
                      />

                  </Campo>

              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>
                <Campo>
                      <label htmlFor="descripcion">Descripción</label>
                      <textarea 
          
                          id="descripcion"
                          name="descripcion"
                          value={descripcion}
                          onChange={handleChange}
                      />
                  </Campo>

                  {errores.descripcion && <Error>{errores.descripcion}</Error> }
              </fieldset>

              {error && <Error>{error} </Error>}
  
              <InputSubmit 
                type="submit"
                value="Crear Producto"
              />
          </Formulario>
        </>
        )}
      </Layout>
    </div>
  )
}

  export default NuevoProducto;