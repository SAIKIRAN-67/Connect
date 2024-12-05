import React, { useState } from "react";
import styled from "styled-components";
import { FaHome, FaUserCircle, FaSearch } from "react-icons/fa";

const NavbarContainer = styled.nav`
  background: linear-gradient(90deg, #007bff, #00bcd4);
  width: 100%;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.h1`
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
`;

const NavLink = styled.a`
  color: #fff;
  font-size: 20px; /* Increased size */
  text-decoration: none;
  font-weight: 600;
  position: relative;
  padding: 8px 0;
  transition: color 0.3s ease;

  &:hover {
    color: #ffd700;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background-color: #ffd700;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  gap: 15px;
  border: 2px solid #007bff;
  background: transparent; /* Removed the white background */
`;

const SearchInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const SearchInputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #fff; /* Adjusted label color for consistency */
`;

const SearchInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px;
  font-size: 16px;
  width: 200px; /* Slightly increased width for better usability */
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(90deg, #00c853, #64dd17);
  border: none;
  color: #fff;
  padding: 12px 25px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(90deg, #64dd17, #00c853);
    transform: translateY(-2px);
  }
`;

function Navbar() {
  const [searchQuery, setSearchQuery] = useState({ district: "", constituency: "", problemId: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    alert(`Searching for: ${JSON.stringify(searchQuery)}`);
    // Add search functionality here
  };

  return (
    <NavbarContainer>
      <Logo>MyApp</Logo>
      <NavLinks>
        <NavLink href="#home">
          <FaHome /> Home
        </NavLink>
        <NavLink href="#profile">
          <FaUserCircle /> Profile
        </NavLink>
      </NavLinks>
      <SearchBar>
        <SearchInputContainer>
          <SearchInputLabel htmlFor="district">District</SearchInputLabel>
          <SearchInput
            id="district"
            type="text"
            name="district"
            placeholder="Enter District"
            value={searchQuery.district}
            onChange={handleInputChange}
          />
        </SearchInputContainer>
        <SearchInputContainer>
          <SearchInputLabel htmlFor="constituency">Constituency</SearchInputLabel>
          <SearchInput
            id="constituency"
            type="text"
            name="constituency"
            placeholder="Enter Constituency"
            value={searchQuery.constituency}
            onChange={handleInputChange}
          />
        </SearchInputContainer>
        <SearchInputContainer>
          <SearchInputLabel htmlFor="problemId">Problem ID</SearchInputLabel>
          <SearchInput
            id="problemId"
            type="text"
            name="problemId"
            placeholder="Enter Problem ID"
            value={searchQuery.problemId}
            onChange={handleInputChange}
          />
        </SearchInputContainer>
        <SearchButton onClick={handleSearch}>
          <FaSearch /> Search
        </SearchButton>
      </SearchBar>
    </NavbarContainer>
  );
}

export default Navbar;
