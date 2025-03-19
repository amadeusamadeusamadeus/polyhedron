// src/components/Header.jsx
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import LoginForm from './LoginForm.jsx';
import Button from "./UI/Button.jsx";
import {useContext, useState, useEffect, useRef} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../store/AuthContext.jsx";

// display: none when "invisible", transition smooth

function Header() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;


    // Auto-hiding logic: show header when scrolling up or at the top
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const atBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 2;

            if (currentScrollY === 0) {
                setShowHeader(true);
            } else if (!atBottom && currentScrollY < lastScrollY.current) {
                // Scrolling up and not at the bottom: show header.
                setShowHeader(true);
            } else {
                // Scrolling down or at the bottom: hide header.
                setShowHeader(false);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => setShowOffcanvas(true);

    const handleLogout = () => {
        authCtx.logout();
        setShowOffcanvas(false);
        navigate("/");
    };

    function handleNav() {
        setShowOffcanvas(false);
    }

    function AdminDashboardLink() {
        if (authCtx.isAuthenticated && authCtx.user?.role === "admin") {
            return <NavLink to="/admin-dashboard" className="nav-link active">Admin Dashboard</NavLink>;
        }
        return null;
    }

    return (
        <div className={`site-header ${showHeader ? 'visible' : 'hidden'}`} role="banner">
            <div className="header-container">
                {[false].map((expand) => (
                    <Navbar key={expand} expand={expand} className="main-header mb-1" variant="dark">
                        <Container fluid>
                            <Navbar.Brand as={NavLink} to="/" className="fs-4" id="header-title">
                                Polyhedron
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} onClick={handleShow}/>
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                                show={showOffcanvas}
                                onHide={handleClose}
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                        {authCtx.isAuthenticated && authCtx.user
                                            ? `Signed in as: ${authCtx.user.firstName ? `${authCtx.user.firstName}` : "admin"}`
                                            : "Not signed in"}
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Nav className="justify-content-end flex-grow-1 pe-3">
                                        {authCtx.isAuthenticated ? (
                                            authCtx.user.role === "admin" ? (
                                                <>
                                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                                    <AdminDashboardLink/>
                                                    <Button className="nav-link active" onClick={handleLogout}>
                                                        Logout
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <NavLink to="/" className="nav-link"
                                                             onClick={handleNav}>Home</NavLink>
                                                    <NavLink to="/orders" className="nav-link"
                                                             onClick={handleNav}>Orders</NavLink>
                                                    <NavLink to="/settings" className="nav-link"
                                                             onClick={handleNav}>Settings</NavLink>
                                                    <NavLink to="/cart" className="nav-link" onClick={handleNav}>View
                                                        Cart</NavLink>
                                                    <NavLink to="/checkout" className="nav-link" onClick={handleNav}>Go
                                                        to Checkout</NavLink>
                                                    <AdminDashboardLink/>
                                                    <Button className="nav-link active" onClick={handleLogout}>
                                                        Logout
                                                    </Button>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <LoginForm/>
                                                <NavLink to="/" className="nav-link">Home</NavLink>
                                                <NavLink to="/signup" className="nav-link">Create New Account</NavLink>
                                            </>
                                        )}
                                    </Nav>
                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        </Container>
                    </Navbar>
                ))}
            </div>
        </div>
    );
}

export default Header;
