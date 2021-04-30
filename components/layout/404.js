import React from 'react';
import {css} from '@emotion/react';


const Error404 = () => {
    return (
        <div
            css={css`
                margin-top: 5rem;
                text-align: center;
            `}
        >
            <h1>La página a la cual deseas acceder no existe</h1>
        </div>
    );
};

export default Error404;