import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import LoginForm from './LoginForm.jsx';
import Button from "./UI/Button.jsx"
import {useContext} from 'react';
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import { NavLink } from "react-router-dom";

function OffcanvasBar() {

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="main-header bg-white mb-1">
                    <Container fluid>
                        <Navbar.Brand as={NavLink} to="/" className="title fs-3">
                            Polyhedron
                        </Navbar.Brand>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}/>
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    $username
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <LoginForm/>
                                    <NavLink to="/">Home</NavLink>
                                    <NavLink to="/signup">Sign up</NavLink>
                                    <NavLink to="/orders">Orders</NavLink>
                                    <NavLink to="/settings">Settings</NavLink>
                                    <NavLink to="/settings">Logout</NavLink>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>

                </Navbar>

            ))}

        </>
    );
}

export default OffcanvasBar;