import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import * as palette from '../Variables';
import { LightFull, WaterFull, Heart, Star } from '../assets/AllSvg';
import { useUserAuth } from '../userAuthContext';
import Loader from '../Components/Loader';

const Plant = () => {
  let { plantId } = useParams();
  const { user, handleDelete, plantsList } = useUserAuth();
  const [plant,setPlant] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(1);
  const [favourite, setFavourite] = useState(false);
  
  useEffect(() => {
    setPlant(plantsList.filter(el => el.id === plantId)[0]);
    setIsLoading(false);
  },[])
  
  /* get the plant data from Firebase
    import { doc } from 'firebase/firestore';
    import { db } from '../firebase-config';
    const docRef = doc(db, "plants", plantId);
    useEffect(() => {
      const getPlant = async () => {
        const data = await getDoc(docRef);
        setPlant({...data.data(), id:data.id});
        setIsLoading(false);
      }

      getPlant();
    },[]);
  */
  
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
      {isloading ? <Loader /> : 
        <>
          <BackToHomePageBtn to="/">&#10140;</BackToHomePageBtn>
          <Slider>
            {plant.imagesUrl && plant.imagesUrl.map((imgUrl, index) => {
              return (
                <div key={(plant.id + Math.random() * 1000).replace(".","a")}>
                  <RightImage className={slideIndex === index ? "show" : "hide"} >
                    <img src={imgUrl} alt="Plant" />
                  </RightImage>
                  <LeftImage className={slideIndex === index + 1 ? "show" : "hide"} >
                    <img src={imgUrl} alt="Plant" />
                  </LeftImage>
                  <p className='slideNumber'>{slideIndex} / {plant.imagesUrl.length}</p>
                </div>
              )
            })}
            <button className="prev" onClick={prevSlide}>&#10094;</button>
            <button className='next' onClick={nextSlide}>&#10095;</button>
          </Slider>
          <SubContainer>
            <Description>
              <h4>{plant.plantName}</h4>
              <p className='plantRating'>
                <Star width="15px"/>
                <span>5.5 / 10 Reviews</span>
              </p>
              <FavoriteBtn onClick={handleFavourite}> <Heart width="25px" height="25px"fill={favourite ? 'red' : palette.LIGHT_GREEN}/></FavoriteBtn>
              <p className='plantDescription'>{plant.plantDescription ? plant.plantDescription : "No description yet!"}</p>
            </Description>
          </SubContainer>
          <SubContainer>
            <SubContainerPlantCare>
              <CareTypes>
                <h4>Sun Exposure</h4>
                <div className='careLine'>
                  <span className={`careWidth ${plant.light === "Full Light Needed" ? "sunWidthFull" : plant.light === "Partial Light Needed" ? "sunWidthPartial" : plant.light === "Low Light Needed" ? "sunWidthZero" : "noInfo"}`}>
                  </span>
                  <LightFull width="20px" className={plant.light === "Full Light Needed" ? "careFull" : plant.light === "Partial Light Needed" ? "careMiddle" : plant.light === "Low Light Needed" ? "careZero" : "noInfo"}/>
                  <p>{plant.light ? plant.light : "No information"}</p>
                </div>
              </CareTypes>
              <CareTypes>
                <h4>Watering</h4>
                <div className='careLine'>
                  <span className={`careWidth ${plant.water === "More Water Needed" ? "waterWidthFull" : plant.water === "Normal Water Needed" ? "waterWidthPartial" : plant.water === "Less Water Needed" ? "sunWidthZero" : "noInfo"}`}>
                  </span>
                  <WaterFull width="18px" fill="#0051ff" className={plant.water === "More Water Needed" ? "careFull" : plant.water === "Normal Water Needed" ? "careMiddle" : plant.water === "Less Water Needed" ? "careZero" : "noInfo"}/>
                  <p>{plant.water ? plant.water : "No information"}</p>
                </div>
              </CareTypes>
            </SubContainerPlantCare>
          </SubContainer>
          <SubContainer>
            <Comments>
              <h3>Coments</h3>
              <AddCommentsBtn>Add</AddCommentsBtn>
              <Line />
              <Comment>
                <img src={plant.author.photo} alt="plant_photo" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque quae nam at aperiam voluptatem repellat! Deleniti facilis fugiat eum est!</p>
                <span>21.03.2022</span>
              </Comment>
              <Line /> 
              <Comment>
                <img src={plant.author.photo} alt="plant_photo" />
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, sit impedit error odit necessitatibus atque?</p>
                <span>21.03.2022</span>
              </Comment>
              <Line />
              <Comment>
                <img src={plant.author.photo} alt="plant_photo" />
                <p>Lorem ipsum dolor sit amet.</p>
                <span>21.03.2022</span>
              </Comment>
              <Line />
            </Comments>
          </SubContainer>
          <SubContainer>
            {plant.author.id === user.uid && 
              <DeleteBtn onClick={() => handleDelete(plant.id)}>Delete</DeleteBtn>
            }
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
  margin: 40px 0;

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
    border: none;
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
    font-size: ${palette.FONTSIZE_L};
    margin-bottom: 25px;
  }

  .plantRating{
    position: absolute;
      top: 40px;
      right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${palette.DARK_GREEN};
    font-size: calc(${palette.FONTSIZE_XS} + 2px);
    font-weight: bold;

    svg{
      margin-right: 5px;
    }
  }

  .plantDescription{
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

const SubContainerPlantCare = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const CareTypes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;

  background-color: ${palette.LIGHT_GREEN};
  border-radius: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -120px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

  h4{
    display: block;
    color: ${palette.DARK_GREEN};
    margin: 15px 0;
    font-size: ${palette.FONTSIZE_S};
    text-align: center;
  }

  .careLine{
    position: relative;
    width: 75%;
    height: 4px;
    background-color: ${palette.LIGHT_GRAY};
    border-radius: 4px;
    margin-bottom: 35px;
    
    svg{
      position: absolute;
      top: -8px;
      z-index: 99;
    }

    p{
      color: ${palette.DARK_GRAY};
      margin: 10px 0;
      font-size: ${palette.FONTSIZE_XS};
      text-align: center;
    }

    .careWidth{
      position: absolute;
        top: -1px;
        left: 0;
      width: 5%;
      height: 6px;
      border-radius: 4px;
    }

    .careFull{
      left: 90%;
    }

    .careMiddle{
      left: 45%;
    }

    .careZero{
      left: -10px;
    }

    .noInfo{
      display: none;
    }

    .sunWidthFull {
      background-color: #ffff00;
      width: 100%;
    }

    .sunWidthPartial {
      background-color: #ffff00;
      width: 50%;
    }

    .sunWidthZero {
      width: 0%;
    }

    .waterWidthFull {
      background-color: #0077ff;
      width: 100%;
    }

    .waterWidthPartial {
      background-color: #0077ff;
      width: 50%;
    }

    .waterWidthZero {
      width: 0%;
    }
  }
`;

const Comments = styled.div`
  position: relative;
  width: 90%;
  color: ${palette.DARK_GREEN};
  background-color: ${palette.LIGHT_GREEN};
  border-radius: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -120px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  padding: 20px;

  h3{
    display: block;
    margin-bottom: 5px;
  }
`;

const Comment = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;

  img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 15px;
  }

  p{
    font-size: ${palette.FONTSIZE_S};
    text-align: justify;
    margin-left: 15px;
    margin-bottom: 15px;
  }

  span{
    position: absolute;
      right: 0;
      bottom: 0;
    font-size: ${palette.FONTSIZE_XS};
  }
`;

const AddCommentsBtn = styled.button`
  position: absolute;
    top: 15px;
    right: 5%;
  color: ${palette.DARK_GREEN};
  background-color: ${palette.LIGHT_GREEN};
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -120px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  font-weight: bold;
  transition: all 100ms ease;

  :hover{
    cursor: pointer;
    transform: scale(1.03);
  }

  :active{
    transform: scale(0.98);
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${palette.DARK_GREEN};
  margin: 15px 0;
`;

const DeleteBtn = styled.button`
  align-self: flex-end;
  color: #ffffff;
  background-color: #c41717;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -120px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  padding: 12px 30px;
  margin-right: 3px;
  font-size: ${palette.FONTSIZE_M};
  font-weight: bold;
  letter-spacing: .5px;
  transition: all 100ms ease;

  :hover{
    cursor: pointer;
    transform: scale(1.03);
  }

  :active{
    transform: scale(0.98);
  }
`; 

export default Plant;
