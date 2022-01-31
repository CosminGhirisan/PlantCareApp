import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { db } from '../firebase-config';
import * as palette from '../Variables';
import { LightFull, LightLow, LightPartial, Water, WaterFull, WaterHalf, Heart } from '../assets/AllSvg';
import { useUserAuth } from '../userAuthContext';
import Loader from '../Components/Loader';

const Plant = () => {
  let { plantId } = useParams();
  const { loading } = useUserAuth();
  const [plant,setPlant] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const [favourite, setFavourite] = useState(false);
  const docRef = doc(db, "plants", plantId)

  useEffect(() => {
    const getPlant = async () => {
        const data = await getDoc(docRef);
        setPlant(data.data());
    }

    getPlant();
  },[]);

  const nextSlide = () => {
    if(slideIndex !== plant.imagesUrl.length) {
      setSlideIndex(slideIndex + 1);
    } else if(slideIndex === plant.imagesUrl.length){
      setSlideIndex(1);
    }
  }

  const prevSlide = () => {
    if(slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
    } else if(slideIndex === 1){
      setSlideIndex(plant.imagesUrl.length);
    }
  }

  const handleFavourite = () => {
    if(!favourite) {
      setFavourite(true)
    } else {
      setFavourite(false)
    }
  }

  return (
    <Container>
      {loading ? <Loader /> : 
      <>
        <BackToHomePageBtn to="/">&#10140;</BackToHomePageBtn>
        <Slider>
          {plant.imagesUrl && plant.imagesUrl.map((imgUrl, index) => {
            return (
              <>
                <RightImage className={slideIndex === index ? "show" : "hide"} >
                  <img src={imgUrl} alt="Plant" />
                </RightImage>
                <LeftImage className={slideIndex === index + 1 ? "show" : "hide"} >
                  <img src={imgUrl} alt="Plant" />
                </LeftImage>
                <p className='slideNumber'>{slideIndex} / {plant.imagesUrl.length}</p>
              </>
            )
          })}
          <a className="prev" onClick={prevSlide}>&#10094;</a>
          <a className='next' onClick={nextSlide}>&#10095;</a>
        </Slider>
        <SubContainer>
          <Description>
            <h4>{plant.plantName}</h4>
            <span className='plantsAge'>Plant's Age:{plant.yearsOld} {plant.yearsOld == 1 ?`Year`:`Years`}</span>
            <FavoriteBtn onClick={handleFavourite}> <Heart width="25px" height="25px"fill={favourite ? 'red' : palette.LIGHT_GREEN}/></FavoriteBtn>
            <p>{plant.plantDescription ? plant.plantDescription : "No description yet!"}</p>
          </Description>
        </SubContainer>
      </>
      }     
    </Container>
  )
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 400px;
  height: 94vh;
  background: transparent;
  margin: auto;
  overflow: scroll;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 400px;
  background: transparent;
  margin-bottom: 20px;

  :last-child{
    margin-bottom: 10rem;
  }
`;

const Description = styled.div`
  position: relative;
  align-self: flex-end;
  width: 80%;
  color: ${palette.DARK_GREEN};
  background-color: ${palette.LIGHT_GREEN};
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -120px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  padding: 20px 20px 20px 25px;

  h4{
    margin-bottom: 25px;
  }

  .plantsAge{
    position: absolute;
    top: 40px;
    right: 20px;
    color: ${palette.DARK_GRAY};
    font-size: calc(${palette.FONTSIZE_XS} + 2px);
    font-style: italic;
    font-weight: lighter;
  }

  p{
    text-align: justify;
    font-size: ${palette.FONTSIZE_S};
  }
`;

const FavoriteBtn = styled.button`
  position: absolute;
    top: -20px;
    right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${palette.DARK_GREEN};
  border: none;

  :hover{
    cursor: pointer;
  }
`;

const BackToHomePageBtn = styled(Link)`
  align-self: flex-start;
  color: ${palette.DARK_GREEN};
  margin-top: 20px;
  font-size: 30px;
  text-decoration: none;
  transform: rotate(180deg);

  :hover{
      color: ${palette.LIGHT_GREEN};
  }
`;

const Slider = styled.div`
  position: relative;
  width: 400px;
  margin: 30px 0;

  .slideNumber{
    position: absolute;
      bottom: 20px;
      right: 40px;
    color: ${palette.DARK_GREEN};
    font-size: ${palette.FONTSIZE_M};
    font-weight: 600;
    opacity: 0.3;
  }

  .show{
    display: block;
  }

  .hide{
    display: none;
  }

  .prev, 
  .next{
    position: absolute;
      top: 55%;
    width: auto;
    color: ${palette.LIGHT_GREEN};
    background-color: ${palette.DARK_GREEN};
    border-radius: 50%;
    padding: 5px 10px;
    margin: -22px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.5;
    transition: 0.6s ease;

    :hover{
        opacity: 1;
    }
  }

  .prev{
    left: 50px;
  }

  .next{
    right: 50px;
  }

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LeftImage = styled.div`
  width: 300px;
  height: 350px;
  border-radius: 20px;
  box-shadow: 4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38);
  overflow: hidden;
  transform: perspective(800px) rotateY(30deg);
  z-index: 4;
`;

const RightImage = styled.div`
  position: absolute;
    top: 15px;
    right: 30px;
  width: 80px;
  height: 100px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  overflow: hidden;
  z-index: 0;
`;

export default Plant;
