import styled from "styled-components";
import { NavLink } from "react-router-dom";

const COLORS = {
  primaryDark: "#115b4c",
  primaryLight: "#B6EDC8",
};

export const OptionButton = styled.button`
  display: inline-block;
  font-size: 2rem; /* Smaller font size */
  font-weight: 350;
  text-decoration: none;
  color: ${COLORS.primaryDark}; /* Dark color for visibility */
  padding: 0.5rem 1rem; /* Smaller padding */
  margin: 1rem;
  border: none;
  cursor: pointer;

  background-color: transparent; /* No background color initially */

  transition: all 0.4s;

  &:hover,
  &:active {
    background-color: ${COLORS.primaryLight}; /* Light background on hover */
    color: ${COLORS.primaryDark}; /* Dark color on hover */
    transform: translateX(1rem); /* Smaller movement on hover */
  }
`;




export const Title = styled.h1`
  font-size: 3em;
  position: fixed;
  left: 39%;
  text-align: center;
  color: #fff;
  padding-left: 50px;
`;

export const Navigation = styled.nav`
  height: 110vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 400;
  width: 100%;
  opacity: 1;
`;

export const List = styled.ul`
  position: absolute;
  list-style: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
`;

export const ItemLink = styled(NavLink)`
  display: inline-block;
  font-size: 2.5rem;
  font-weight: 350;
  text-decoration: none;
  color: ${COLORS.primaryLight};
  padding: 1rem 2rem;

  background-image: linear-gradient(
    1200deg,
    transparent 0%,
    transparent 50%,
    #fff 50%
  );
  background-size: 240%;
  transition: all 0.4s;

  &:hover,
  &:active {
    background-position: 100%;
    color: ${COLORS.primaryDark};
    transform: translateX(2rem);
  }
`;

const Modal = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  width: 300px; /* Adjust the width as needed */
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;