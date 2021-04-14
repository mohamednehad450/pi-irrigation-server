import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom'

interface NavItemProps {
    Icon?: ReactNode,
    path: string
}

const NavItem = (props: NavItemProps) => {
    return (
        <li className="nav-item">
            <Link to={props.path} className="nav-link">
                {props.Icon}
            </Link>
        </li>
    );
}

export default NavItem;
