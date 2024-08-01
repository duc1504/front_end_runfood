import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ name }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <li className="nav-item mb-2">
      <DropdownButton
        id="dropdown-basic-button"
        title={
          <>
            <FontAwesomeIcon icon={faCircleUser} className="me-1" />
            {name}
          </>
        }
        className="nav-link mx-2 text-uppercase"
      >
        <Dropdown.Item onClick={() => navigate("/settings")}>Settings</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
      </DropdownButton>
    </li>
  );
};

export default UserDropdown;
