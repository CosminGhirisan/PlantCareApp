import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

import * as palette from '../Variables';
import logo from '../assets/images/logo.png'
import { AddPlant, Profile } from '../assets/AllSvg';
import { useUserAuth } from '../userAuthContext';

const Navbar = () => {
   const { user } = useUserAuth();

   return (
      <Container>
         <HomeBtn>
            <Link to="/">
               <img src={logo} width="50px" height="auto"/>
            </Link>
         </HomeBtn>
         <AddBtn>
            <Link to="/add-new-plant">
               <AddPlant width={50} height={50} fill="#fff" />
            </Link>
         </AddBtn>
         <ProfileBtn>
            <Link to="/user-profile">
               {!user
               ? <Profile fill={palette.DARK_GREEN}/>
               : <img src={user.photoURL} alt="profile" width="50px" height="auto"/>
               }
               {/* <Profile fill={palette.DARK_GREEN}/> */}
            </Link>
         </ProfileBtn>
      </Container>
   )
}


const Container = styled.div`
   position: fixed;
   bottom: 0;
   display: flex;
   align-items: center;
   justify-content: space-evenly;
   width: 100%;
   height: 4rem;
   background-color: ${palette.LIGHT_GREEN};
   box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
   border-top-left-radius: 2rem;
   border-top-right-radius: 2rem;
   z-index: 10;

   @media only screen and (min-width: 600px) {
      width: 400px;
      left: 50%;
      transform: translateX(-50%);
   }
`;

const HomeBtn = styled.button`
   background: transparent;
   padding: 0.25rem;
   border: none;
   text-decoration: none;
   cursor: pointer;
   transition: all 500ms ease;

   :hover{
      transform: scale(1.3);
   }
   :active{
      transform: scale(1);
   }
`;

const AddBtn = styled.button`
   background: ${palette.LIGHT_GREEN};
   padding: 1.5rem;
   margin-bottom: 2rem;
   border: none;
   border-radius: 50%;
   box-shadow: 0px 11px 18px 0px #fff;
   text-decoration: none;
   cursor: poiner;
   transition: all 500ms ease;

   :hover{
      transform: scale(1.1);
   }
   :active{
      transform: scale(1);
   }
`;

const ProfileBtn = styled.button`
   background: transparent;
   padding: 0.25rem;
   border: none;
   text-decoration: none;
   cursor: pointer;
   transition: all 500ms ease;

   :hover{
      transform: scale(1.3);
   }
   :active{
      transform: scale(1);
   }

   img{
      border-radius: 50%;
   }
`;

export default Navbar
