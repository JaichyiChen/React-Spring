import { NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
export const Navbar = () => {
    const { oktaAuth, authState } = useOktaAuth();
    if (!authState) {
        return <SpinnerLoading></SpinnerLoading>;
    }

    const handleLogout = async () => {
        return oktaAuth.signOut();
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    Books 2 Read
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle Navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collaspse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/search">
                                Search Books
                            </NavLink>
                        </li>
                        {authState.isAuthenticated && <li className='nav-item'>
                            <NavLink className='nav-link' to='shelf'>Shelf</NavLink>
                        </li>}
                        {
                            authState.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' &&
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='admin'>Admin</NavLink>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {authState.isAuthenticated ? (
                            <li className="nav-item m-1">
                                <button
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item m-1">
                                <a
                                    type="button"
                                    className="btn btn-outline-light"
                                    href="/login"
                                >
                                    Sign in
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
