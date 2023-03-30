
import React, { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Outlet, useNavigate } from 'react-router-dom';

//used to wrap routes that needs the user to be authenticated
export const Protected = () => {

    const { oktaAuth, authState } = useOktaAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authState?.isAuthenticated === false) {
            navigate('/login')
        }
    }, [authState, navigate, oktaAuth])

    return (
        <Outlet></Outlet>
    )
}
