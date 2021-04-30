import React, {useEffect, useContext, useState} from 'react';
import {useRouter} from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import Layout from '../../components/layout/Layout';
import { FirebaseContext }  from '../../firebase';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/InterfazUsuario/Formulario';
import Boton from '../../components/InterfazUsuario/Boton';

const ContenedorProducto = styled.div`
    @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;
const CreadorProducto = styled.p`
    padding: .1rem 1rem;
    background-color: #e1e1e1;
    color: #DA552F;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    border-radius: 40px;
`;
const Producto = () => {

    //State del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    //Routing para obtener el id Actual
    const router = useRouter();
    const { query: {id}} = router;

    //Context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB){
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists){
                    guardarProducto(producto.data());
                    guardarConsultarDB(false);
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';
    const { comentarios, creado, descripcion, empresa, nombre, urlimagen, votos, creador, haVotado} = producto;

    //Administrar y validar los votos
    const votarProducto = () => {
        if(!usuario) {
            return router.push('/login');
        }

        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //Verificar si un usuario ya a votado
        if(haVotado.includes(usuario.uid) ) return;

        //Guardar el id del usuario que ya ha votado
        const nuevoVoto = [...haVotado, usuario.uid];
        
        //Actualizar en la base de datos
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoVoto
        });

        //Actualizar en el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        });

        guardarConsultarDB(true); //Hay un voto, consultar a la BD
    }

    //Funciones para los comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        });
    }
    //identidicar si el comentario es del autor
    const esCreador = id => {
        if(creador.id == id) {
            return true;
        }
    }
    const agregarComentario = e => {
        e.preventDefault();
        if(!usuario) {
            return router.push('/login');
        }

        //Información extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //Tomar una copia de los comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        //Actualizar la BD
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        });

        //Actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        });
        guardarConsultarDB(true); //hay un comentario, por lo tanto consultar a la BD
    }

    // función que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true
        }
    }

    // elimina un producto de la bd
    const eliminarProducto = async () => {

        if(!usuario) {
            return router.push('/login')
        }

        if(creador.id !== usuario.uid) {
            return router.push('/')
        }

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
               <>
                  {error ? <Error404 /> : (

                  <div className="contenedor">
                        <h1 css={css`
                            text-align: center;
                            margin-top: 1rem;
                        `}>
                            {nombre}
                        </h1>
                        <ContenedorProducto>
                            <div css={css`
                                border: 1px solid #e1e1e1;
                                padding: 5px;
                            `}>
                                    <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )} </p>
                                    <p>Publicado por: {creador.nombre} de: {empresa} </p>
                                    <img css={css`
                                        width: 100%;
                                    `}
                                    
                                    src={urlimagen} />
                                    <p>{descripcion}</p>
                                        

                                    <h2 css={css`
                                        margin: 2rem 0;
                                    `}>Comentarios</h2>
                                        {comentarios.length === 0 ? "No hay comentarios" : (
 
                                        <ul>
                                             {comentarios.map((comentario, i) => (
                                                <li
                                                    key={`${comentario.usuarioId}-${i}`}
                                                    css={css`
                                                        border: 1px solid #e1e1e1;
                                                        margin-bottom: 4px;
                                                        padding: 5px
                                                    `}
                                                >
                                                    <p>{comentario.mensaje}</p>
                                                    <p>Escrito por:
                                                         <span
                                                            css={css`
                                                                font-weight: bold;
                                                            `}
                                                         >
                                                            {''} {comentario.usuarioNombre} {''}
                                                             {esCreador(comentario.usuarioId) && 
                                                             <CreadorProducto>Autor</CreadorProducto>}
                                                         </span> 
                                                    </p>
                                                   
                                                </li>
                                            ))}
                                        </ul>
                                        )} 
                                </div>

                            <aside css={css`
                                border: 1px solid #e1e1e1;
                                padding: 5px;
                            `}>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={urlimagen}
                                >Visitar URL</Boton>

                                <div
                                   css={css`
                                        margin-top: 5rem;  
                                   `}
                                >
                                <p
                                    css={css`
                                        text-align: center;
                                    `}
                                >{votos} Votos </p>

                                { usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >
                                        Votar
                                    </Boton>
                                ) }

                                { puedeBorrar() && 
                                    <Boton
                                        onClick={eliminarProducto}
                                        >Eliminar Producto
                                    </Boton>
                                }
                                
                                 { usuario ? (
                                        <>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"  
                                                    placeholder="Escribe tu comentario..."                               
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                        </>
                                    ) : "Inicie sesión para poder votar y comentar"}
                                </div>
                            </aside>
                        </ContenedorProducto>
                  </div>
                  )}
               </>
        </Layout>
    );
};

export default Producto;