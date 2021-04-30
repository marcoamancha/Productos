import React from 'react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import Link from 'next/link';

const Producto = styled.li`
    padding: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e1e1e1;
    border-radius: 25px;  
`;
const DescripcionProducto = styled.div`
    flex: 0 1 600px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 2rem;

    @media (max-width: 615px) {
        grid-template-columns: 1fr; 
    }
`;

const Titulo = styled.a`
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
    :hover {
        cursor: pointer;
    }
`;

const TextoDescripcion = styled.p`
    font-size: 1.6rem;
    margin: 0;
    color: #888;
`

const Comentarios = styled.div`
    margin-top: 2rem;
    display: flex;
    align-items: center;
    div {
        display: flex;
        align-items: center;
        border: 1px solid #e1e1e1;
        padding: .3rem 1rem;
        margin-right: 2rem;
    }
    img {
        width: 2rem;
        margin-right: 2rem;
    }
    p {
        font-size: 1.6rem;
        margin-right: 1rem;
        font-weight: 700;
        &:last-of-type {
            margin: 0;
        }
    }
`;

const Imagen = styled.img`
    width: 250px;
`;

const Votos = styled.div`
    flex: 0 0 auto;
    text-align: center; 
    border: 1px solid #e1e1e1;
    padding: 1rem 3rem;
    div {
        font-size: 2rem;
    }
    p {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
    }

    @media (max-width: 615px) {
        // display: grid;
        // grid-template-columns: 1fr 1fr;
        border: none;
        padding-top: 230px; 
        
    }
`;

const DetallesProducto = ({producto}) => {

    const {id, comentarios, creado, descripcion, empresa, nombre, urlimagen, votos} = producto;

    return ( 
        <Link href="/productos/[id]" as={`/productos/${id}`}>
        <Producto>

            <DescripcionProducto>
                <div>
                    <Imagen src={urlimagen}  />
                </div>

                <div>
                    <Titulo>{nombre}</Titulo>
                    <TextoDescripcion>{descripcion}</TextoDescripcion>
                    <Comentarios>
                        <div>
                            <img src="/static/img/comentario.png" />
                            <p>{comentarios.length} Comentarios</p>
                        </div>
                    </Comentarios>
                    <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )} </p>
                </div>
            </DescripcionProducto>
            <Votos>  
                 <div> &#10084; </div>
                 <p>{votos}</p>
            </Votos>
           
            
        </Producto>
        </Link>
     );
};

export default DetallesProducto;