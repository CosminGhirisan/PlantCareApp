import React, { useEffect } from 'react'
import styled from 'styled-components';
import { useUserAuth } from '../userAuthContext';

import * as palette from '../Variables';

const Profile = () => {
   const { signUserOut, user } = useUserAuth();
   
   return (
      <Container>
         <h1>{user && user.displayName}</h1>
         <Logout onClick={signUserOut}>Log Out</Logout>
      </Container>
   )
}

const Container = styled.div`
   height: 90%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   overflow: scroll;

   h1{
      margin: 3rem 0;
   }
`;

const Logout = styled.button`
   color: ${palette.DARK_GREEN};
   background-color: ${palette.LIGHT_GREEN};
   border: 1px solid ${palette.DARK_GREEN};
   border-radius: 3px;
   padding: 10px 20px;
   font-size: 16px;
   font-weight: bold;
   letter-spacing: .5px;
   text-decoration: none;
   text-transform: uppercase;

   :hover{
      color: ${palette.LIGHT_GREEN};
      background-color: ${palette.DARK_GREEN};
      cursor: pointer;
   }
`;

export default Profile
