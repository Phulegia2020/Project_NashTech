//import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";

import React, { Component } from 'react'

class TopBar extends Component {
    state = {
        topbarIsOpen: true
    }

    toggleTopbar = () => {
        this.setState({
            topbarIsOpen: !this.state.topbarIsOpen
        })
    };

    render() {
        return (
            <div>
                <Navbar
                    color="light"
                    light
                    className="navbar shadow-sm p-3 mb-5 bg-white rounded"
                    expand="md"
                    >
                    <Button color="info" onClick={this.props.toggleSidebar}>
                        <FontAwesomeIcon icon={faAlignLeft} />
                    </Button>
                    <NavbarToggler onClick={this.toggleTopbar} />
                    {/* <Collapse isOpen={true} navbar>
                        <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to={"/page-1"}>
                            page 1
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/page-2"}>
                            page 2
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/page-3"}>
                            page 3
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/page-4"}>
                            page 4
                            </NavLink>
                        </NavItem>
                        </Nav>
                    </Collapse> */}
                </Navbar>
            </div>
        )
    }
}


// const Topbar = ({ toggleSidebar }) => {
//   const [topbarIsOpen, setTopbarOpen] = useState(true);
//   const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);

//   return (
//     <Navbar
//       color="light"
//       light
//       className="navbar shadow-sm p-3 mb-5 bg-white rounded"
//       expand="md"
//     >
//       <Button color="info" onClick={toggleSidebar}>
//         <FontAwesomeIcon icon={faAlignLeft} />
//       </Button>
//       <NavbarToggler onClick={toggleTopbar} />
//       <Collapse isOpen={topbarIsOpen} navbar>
//         <Nav className="ml-auto" navbar>
//           <NavItem>
//             <NavLink tag={Link} to={"/page-1"}>
//               page 1
//             </NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to={"/page-2"}>
//               page 2
//             </NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to={"/page-3"}>
//               page 3
//             </NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to={"/page-4"}>
//               page 4
//             </NavLink>
//           </NavItem>
//         </Nav>
//       </Collapse>
//     </Navbar>
//   );
// };

export default TopBar;
