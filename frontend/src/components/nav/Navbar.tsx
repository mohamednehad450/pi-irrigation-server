import React, { ReactNode } from 'react';

interface NavbarProps {
    children: ReactNode,
}

const Navbar = (props: NavbarProps) => {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                {props.children}
            </ul>
        </nav>
    );
}

export default Navbar;
