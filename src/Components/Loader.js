import React from 'react';
import styled from 'styled-components';

import logo from '../assets/images/logo.png'
 
const Loader = () => {
  return (
   <LoaderContainer>
      <img src={logo} alt="logo" />
   </LoaderContainer>
  )};

const LoaderContainer = styled.div`
   position: fixed;
   top: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100vh;
   width: 100vw;
   background: #00808055;
   z-index: 100;

   img{
      width: 100px;
      height: auto;
   }
`;

export default Loader;
