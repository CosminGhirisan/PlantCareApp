import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Link } from 'react-router-dom';

import * as palette from '../Variables';
import { useUserAuth } from '../userAuthContext';
import { auth, db } from '../firebase-config'
import logo from '../assets/images/logo.png'

const Main = () => {
  const { user } = useUserAuth();
  const [plantsList, setPlantsList] = useState([]);
  const plantsCollectionRef = collection(db, "plants")

  useEffect(() => {
    const q = query(plantsCollectionRef, orderBy("timestamp", "desc"))

    const getPlants = async () => {
        const data = await getDocs(q);
        setPlantsList(data.docs.map((doc) => ({...doc.data(), id:doc.id})));         
    }

    getPlants();
  },[]);

  return (<Container>
    <h1>Welcome back,</h1>
    <h3>{user.displayName}</h3>
  </Container>
  )
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 94vh;
  margin: auto;
  overflow: scroll;
  background-color: rgba(255, 127, 80, 0.15);

  @media only screen and (min-width: 600px) {
      width: 400px;
   }

  h1{
    align-self: flex-start;
    color: ${palette.DARK_GREEN};
    margin-top: 3rem;
    font-size: ${palette.FONTSIZE_XL};
    text-indent: .4rem;
  }

  h3{
    align-self: flex-start;
    color: ${palette.DARK_GREEN};
    margin-bottom: 2rem;
    text-indent: 3.5rem;
  }
`;

export default Main;
