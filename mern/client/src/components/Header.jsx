import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Login from './Login.jsx';


function OffcanvasBar() {

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-white mb-1">
                    <Container fluid>
                        <Navbar.Brand href="#" className="fs-3">Polyhedron</Navbar.Brand>
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
                                    <Login />
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