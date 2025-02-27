import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Login from './Login.jsx';
import Button from "./UI/Button.jsx"
import {useContext} from 'react';
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import userProgressContext from "../store/UserProgressContext.jsx";

function OffcanvasBar() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx =  useContext(UserProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item)=>{
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart() {
        userProgressCtx.showCart();
    }

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="main-header bg-white mb-1">
                    <Container fluid>
                        <Navbar.Brand href="#" className="title fs-3">Polyhedron</Navbar.Brand>
                        <Button textOnly onClick={handleShowCart}>  Cart ({totalCartItems})</Button>
                        {/*<div>*/}
                            <Navbar.Brand as={Button} onClick={handleShowCart} textOnly={true} href="#" className="fs-3">
                                {/*Cart ({totalCartItems})*/}
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}/>
                        {/*</div>*/}
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
                                    <Login/>
                                    <Nav.Link href="#action1">Sign up!</Nav.Link>
                                    {/*<Nav.Link href="#action1">Settings</Nav.Link>*/}
                                    {/*<Nav.Link href="#action2">Orders</Nav.Link>*/}
                                    {/*<Nav.Link href="#action3">Logout</Nav.Link>*/}
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