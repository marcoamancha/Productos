import React, {useContext} from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import Buscar from '../components/InterfazUsuario/Buscar';
import Navegacion from '../components/layout/Navegacion';
import Boton from '../components/InterfazUsuario/Boton';
import { FirebaseContext } from '../firebase';


const ContenedorHeader  = styled.div`
        max-width: 1200px;
        width: 95%;
        margin: 0 auto;
        #icon-menu{
            width: 50px;
            height: 50px;
            position: absolute;
            right: 20px;
            top: 16px;
            font-size: 35px;
            color: #DA552F;
            display: none;
            justify-content: center;
            align-items: center;
            padding-top: 13px; 
        }
       
        @media (min-width: 768px){
            display: flex;
            justify-content: space-between;
        }

        
    `
const Logo = styled.p`
        color: var(--naranja);
        font-size: 4rem;
        line-height: 0;
        font-weight: 500;
        font-family: 'Roboto Slab', serif;
        margin-right: 2rem;
`;

const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext);

    return (
        <header
            css={css`
                 border-bottom: 2px solid var(--gris3);
                 padding: 1rem 0;
                 background-color: #252b43;
            `}
        >

        <ContenedorHeader>
            <div
                 css={
                    css`
                     display: flex;
                     align-items: center;
                    `}
            >
                <Link href="/">
                    <Logo>PCH</Logo>
                </Link>

                <Buscar />
               
                <Navegacion />
                
            </div>
            <div
                css={
                    css`
                     display: flex;
                     align-items: center;
                    `}
            >
               {
                   //Ternario para el logeo
                   usuario ? (
                     <>
                        <p
                            css={
                                css`
                                margin-right: 1rem;
                                color: #8088ad;
                                `}
                        >Hola: {usuario.displayName} </p>
                        <Boton
                            bgColor = "true"
                            onClick = { () => firebase.cerrarSesion()}
                        >Cerrar Sesión</Boton>
                     </>
                
                   ) : (
                     <>
                        <Link href="/login">
                        <Boton
                            bgColor="true"
                        >Login</Boton>
                        </Link>
                        <Link href="/crear-cuenta">
                        <Boton>Crear Cuenta</Boton>
                        </Link>
                     </>
                    )
               }
                
            </div>
            <div id="icon-menu">
            <span>&#9776;</span>
            </div>
        </ContenedorHeader>
        </header>
    );
};

export default Header;