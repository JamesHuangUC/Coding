import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">{"Coding"}</Navbar.Brand>
            {/*
            <Nav className="mr-auto"><Nav.Link href="#challenges">Challenges</Nav.Link></Nav>
            */}
        </Navbar>
    );
};

export default Header;
