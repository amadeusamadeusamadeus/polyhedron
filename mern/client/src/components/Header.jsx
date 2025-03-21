import { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import LoginForm from './LoginForm.jsx';
import Button from "./UI/Button.jsx";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../store/AuthContext.jsx";

function Header() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // State to control the visibility of the header
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [isCustomizationMode, setIsCustomizationMode] = useState(false);
    const lastScrollY = useRef(0);

    const isHomePage = location.pathname === "/";

    useEffect(() => {
        if (!isHomePage) {
            return;
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (isCustomizationMode) {
                setShowHeader(false);
            } else if (currentScrollY === 0 || currentScrollY < lastScrollY.current) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isCustomizationMode, isHomePage]);

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

    const headerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
    };

    const enterCustomizationMode = () => {
        setIsCustomizationMode(true);
        setShowHeader(false);
    };

    const exitCustomizationMode = () => {
        setIsCustomizationMode(false);
        setShowHeader(true);
    };

    return (
        <motion.div
            className={`site-header ${showHeader ? 'visible' : 'hidden'}`}
            role="banner"
            variants={headerVariants}
            initial="hidden"
            animate={showHeader ? "visible" : "exit"}
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ display: showHeader ? 'block' : 'none' }}
        >
            <div className="header-container">
                {[false].map((expand) => (
                    <Navbar key={expand} expand={expand} className="main-header mb-1" variant="dark">
                        <Container fluid>
                            <Navbar.Brand as={NavLink} to="/" className="fs-2 p-0" id="header-title">
                                POLYHEDRON
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} onClick={handleShow} />
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                                show={showOffcanvas}
                                onHide={handleClose}
                            >
                                <Offcanvas.Header closeButton />
                                <Offcanvas.Body className="offcanvas-body">
                                    <Nav className="justify-content-end flex-grow-1 pe-3">
                                        {authCtx.isAuthenticated ? (
                                            authCtx.user.role === "admin" ? (
                                                <>
                                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                                    <AdminDashboardLink />
                                                    <Button className="nav-link active" onClick={handleLogout}>
                                                        Logout
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="offcanvas-title">POLYHEDRON</h2>
                                                    <div className="offcanvas-menu-items">
                                                    <NavLink to="/" className="nav-link" onClick={handleNav}>HOME</NavLink>
                                                    <NavLink to="/orders" className="nav-link" onClick={handleNav}>ORDERS</NavLink>
                                                    <NavLink to="/settings" className="nav-link" onClick={handleNav}>SETTINGS</NavLink>
                                                    <NavLink to="/cart" className="nav-link" onClick={handleNav}>VIEW CART</NavLink>
                                                    <NavLink to="/checkout" className="nav-link" onClick={handleNav}>GO TO CHECKOUT</NavLink>
                                                    <AdminDashboardLink />
                                                    </div>
                                                    <Button className="nav-link active mt-5" whileHoverScale={0} onClick={handleLogout}>
                                                        Logout
                                                    </Button>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <LoginForm />
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
        </motion.div>
    );
}

export default Header;
