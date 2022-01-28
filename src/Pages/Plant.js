import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { db } from '../firebase-config';
import * as palette from '../Variables';
import { LightFull, LightLow, LightPartial, Water, WaterFull, WaterHalf } from '../assets/AllSvg';

const Plant = () => {
  let { plantId } = useParams();
  const [plant,setPlant] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
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

  return (
    <Container>
      <BackToHomePageBtn to="/">&#9756;</BackToHomePageBtn>
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
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In et velit, nam dolores ipsa quasi accusamus quos ullam quaerat exercitationem.</p>
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

const BackToHomePageBtn = styled(Link)`
  width: 400px;
  color: ${palette.DARK_GREEN};
  margin-top: 20px;
  font-size: 30px;
  text-decoration: none;

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
