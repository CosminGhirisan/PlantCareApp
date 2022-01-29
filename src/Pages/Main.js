import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Link } from 'react-router-dom';

import * as palette from '../Variables';
import { useUserAuth } from '../userAuthContext';
import { auth, db } from '../firebase-config'
import logo from '../assets/images/logo.png'
import Loader from '../Components/Loader';
import { Search } from '../assets/AllSvg';

const Main = () => {
  const { user } = useUserAuth();
  const searchRefVal = useRef("")
  const [searchTerm, setSearchTerm] = useState("");
  const [plantsList, setPlantsList] = useState([]);
  const [loading, setLoading] = useState(true)
  const plantsCollectionRef = collection(db, "plants")

  useEffect(() => {
    const q = query(plantsCollectionRef, orderBy("timestamp", "desc"))

    const getPlants = async () => {
        const data = await getDocs(q);
        setPlantsList(data.docs.map((doc) => ({...doc.data(), id:doc.id})));
        setLoading(false);
      }
      
    getPlants();
    
  },[searchTerm]);

  return (    
    <Container>
      {loading ? <Loader /> : 
      <>
        <UserInfo className='userInfo'>
          <img src={user.photoURL} alt="user" />
          <div>
            <h2>Welcome {user && user.displayName.split(" ")[0]}!</h2>
            <p>10 Plants</p>
          </div>
        </UserInfo>
        <SearchBar  >
          <Search width="20px" height="20px" fill="#11493b"/>
          <input type="search" placeholder='What are you looking for?' ref={searchRefVal} onChange={() => setSearchTerm(searchRefVal.current.value.toLowerCase())}/>
        </SearchBar>
        {plantsList.filter(e => e.plantName.toLowerCase().includes(searchTerm)).map((plant) => {
          return (
            <>
              {(
                <PlantContainer key={plant.id}>
                  <ImageDiv>
                    {plant.imagesUrl ? <img src={plant.imagesUrl[0]} alt="plant" /> : <img src={logo} alt='image'/>}
                  </ImageDiv>
                  <TextDiv>
                      <div>
                        <h4>{plant.plantName ? plant.plantName : <br/>}</h4>
                        <p>{plant.plantLocation ? plant.plantLocation : <br/>}</p>
                      </div>
                      <div className='groupTwo'>
                        <img src={plant.author.photo ? plant.author.photo : logo} alt="photo" />
                        <LinkToPlant to={plant.id}>Check More</LinkToPlant>
                      </div>
                  </TextDiv>
                </PlantContainer>  
              )}
            </>
          )
        })}
      </>}
       
       
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
  background: transparent;
  margin: auto;
  overflow: scroll;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  width: 400px;
  min-height: 100px;
  margin-left: 40px;

  img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  h2{
    color: ${palette.LIGHT_GREEN};
    margin-top: -10px;
    margin-left: 10px;
    font-family: 'Roboto', sans-serif;
    font-size: ${palette.FONTSIZE_S};
    font-weight: 400;
    letter-spacing: .5px;
  }

  p{
    color: ${palette.DARK_GREEN};
    margin-left: 10px;
    font-size: ${palette.FONTSIZE_L};
    font-weight: bold;
  }
`;

const SearchBar = styled.div`
  position: relative;
  input{
    width: 350px;
    min-height: 35px;
    background-color: ${palette.LIGHT_GREEN};
    border: none;
    border-radius: 15px;
    padding-left: 35px;
    opacity: .3;

    ::placeholder{
    color: ${palette.DARK_GREEN};
    }

    :hover{
      cursor: pointer;
      opacity: .5;
    }
  }

  svg{
    position: absolute;
    top: 7px;
    left: 10px;
  }
`;

const PlantContainer = styled.div`
  position: relative;
  width: 350px;
  min-height: 120px;
  background: ${palette.LIGHT_GREEN};
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  border-radius: 20px;
  margin-top: 3rem;
  margin-bottom: 1rem;

  :last-child{
    margin-bottom: 10rem;
  }
`;

const ImageDiv = styled.div`
  position: absolute;
    left: 15px;
    bottom: 10px;
  width: 100px;
  height: 150px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  overflow: hidden;

  img{
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
`;

const TextDiv = styled.div` 
  position: absolute;
    right: 10px;
    bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 100px;

  h4{
    margin: 10px 0 0 15px;
    color: ${palette.DARK_GREEN};
  }

  p{
    color: ${palette.LIGHT_GRAY};
    margin-left: 15px;
    font-size: ${palette.FONTSIZE_S};
  }
  .groupTwo{
    position: relative;    

    img{
      position: absolute;
        bottom: 0;
        left: 15px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
`;

const LinkToPlant = styled(Link)`
      position: absolute;
        right: 0;
        bottom: 0;
      width: 100px;
      color: ${palette.LIGHT_GREEN};
      background: ${palette.DARK_GREEN};
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      margin-right: 15px;
      font-weight: bold;
      text-decoration: none;
      transition: all 200ms ease;

      :hover{
        color: ${palette.DARK_GREEN};
        background: ${palette.LIGHT_GREEN};
        border: 1px solid ${palette.DARK_GREEN};
        
        cursor: pointer;
        transform: scale(1.02);
      }

      :active{
        transform: scale(0.98);
      }
`;

export default Main;
