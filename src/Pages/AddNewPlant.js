import React, { useState } from 'react'
import styled from 'styled-components'
import { addDoc, collection,  serverTimestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

import * as palette from '../Variables';
import { db, auth, storage } from '../firebase-config'
import { useNavigate } from 'react-router-dom';
import { LightFull, LightLow, LightPartial, Water, WaterFull, WaterHalf } from '../assets/AllSvg';

const AddPlant = () => {
   const [plantSpecies, setPlantSpecies] = useState('');
   const [plantName, setPlantName] = useState("");
   const [plantLocation, setPlantLocation] = useState("");
   const [plantDescription, setPlantDescription] = useState("");
   const [careInstruction, setCareInstruction] = useState("");
   const [light, setLight] = useState("");
   const [water, setWater] = useState("");
   const [images, setImages] = useState([]);
   const [imagesPrepared, setImagesPrepared] = useState(false)
   const imgArray = [];
   const imagesUrl = [];
   
   const [progres, setProgres] = useState(0);
   let navigate = useNavigate();
   const plantsCollectionRef = collection(db, "plants");
   
   const showPreview = (event) => {
      setImagesPrepared(false);
      document.getElementById("preview").innerText = '';

      if(event.target.files.length > 0){
         const imageAmount = event.target.files.length;
         document.getElementById("upload-btn").innerText = "";
         
         for(let i=0; i < imageAmount; i++) {
            const src = URL.createObjectURL(event.target.files[i]);
            document.getElementById("preview").innerHTML += '<img src="'+src+'">';
            imgArray.push(event.target.files[i]);
            uploadImages(event.target.files[i]);
         }
      }
      setImages(images.concat(imgArray));
   }

   const uploadImages = (img) => {
      if(!img) return;

      const storageRef = ref(storage, `/images/${auth.currentUser.displayName}/${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
         "state_changed", 
         (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);  
            setProgres(prog);
         },
         (err) => console.log(err), 
         () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then(url => {
               imagesUrl.push(url)
               localStorage.setItem("imagesUrl", JSON.stringify(imagesUrl))
               setImagesPrepared(true)
            })
         }
      );
   }
   
   const addNewPlant = async (e) => {      
      await addDoc(plantsCollectionRef, {
         plantSpecies, 
         plantName, 
         plantLocation, 
         plantDescription, 
         careInstruction,
         light,
         water,
         timestamp: serverTimestamp(),
         author: { 
            name: auth.currentUser.displayName, 
            id: auth.currentUser.uid
         },
         imagesUrl: JSON.parse(localStorage.getItem("imagesUrl")),
         year: new Date().getFullYear()
      });
      // alert("New Plant was added!")
      navigate("/");
      localStorage.removeItem("imagesUrl")
   }

   return (
      <Container>
         <h1>Add A New Plant</h1>
         <Form>
            <ul>
               <li>
                  <h4>Information</h4>
                  <input type="text" name="Species" placeholder='Your plant species...' className='lineBorderFull' onChange={(event) => {setPlantSpecies(event.target.value)}}/>
               </li>
               <li className='inlineInfo'>
                  <input  type="text" name="Name" placeholder='Plant Name...'className='lineBorder' onChange={(event) => {setPlantName(event.target.value)}}/>
                  <input  type="text" name="Location" placeholder='Location...'className='lineBorder' onChange={(event) => {setPlantLocation(event.target.value)}}/>
               </li>
               <li>
                  <h4>Description</h4>
                  <textarea name="Description" cols="30" rows="5" placeholder='Description of your plant...' onChange={(event) => {setPlantDescription(event.target.value)}}></textarea>
               </li>
               <li>
                  <h4>Care Instruction</h4>
                  <textarea name="CareInstruction" cols="30" rows="2" placeholder='Care Instruction...' onChange={(event) => {setCareInstruction(event.target.value)}}></textarea>
                  <div className='inlineInfo'>
                     <Checkboxes>
                        <label>
                           <input type="radio" name="radioBtn-light" value="Full Light Needed" onChange={e => setLight(e.target.value)}/>
                           <div className="icon-box">
                              <LightFull />
                           </div>
                        </label>
                        <label>
                           <input type="radio" name="radioBtn-light" value="Partial Light Needed" onChange={e => setLight(e.target.value)}/>
                           <div className="icon-box">
                              <LightPartial />
                           </div>
                        </label>
                        <label>
                           <input type="radio" name="radioBtn-light" value="Low Light Needed" onChange={e => setLight(e.target.value)}/>
                           <div className="icon-box">
                              <LightLow />
                           </div>
                        </label>
                     </Checkboxes>
                     <Checkboxes>
                        <label>
                           <input type="radio" name="radioBtn-water" value="Less Water Needed" onChange={e => setWater(e.target.value)}/>
                           <div className="icon-box">
                              <Water />
                           </div>
                        </label>
                        <label>
                           <input type="radio" name="radioBtn-water" value="Normal Water Needed" onChange={e => setWater(e.target.value)}/>
                           <div className="icon-box">
                              <WaterHalf />
                           </div>
                        </label>
                        <label>
                           <input type="radio" name="radioBtn-water" value="More Water Needed" onChange={e => setWater(e.target.value)}/>
                           <div className="icon-box">
                              <WaterFull />
                           </div>
                        </label>
                     </Checkboxes>
                  </div>
               </li>
               <li>
                  <h4>Images</h4>
                  <div className="form-input">
                     <div id="preview">

                     </div>
                     <label htmlFor="file-id" id="upload-btn">+</label>
                     <input type="file" multiple id='file-id' accept='image/*' onChange={event => showPreview(event)} />
                  </div>
               </li>
               <li>
                  {!imagesPrepared && <DisabledBtn>Add a photo</DisabledBtn>}
                  {imagesPrepared && <AddPlantBtn onClick={addNewPlant}>Add Plant</AddPlantBtn>}
               </li>
            </ul>
         </Form>
      </Container>
   )
}

const Container = styled.div`
   height: 90%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: start;
   overflow: scroll;

   h1{
      margin: 3rem 0;
      color: ${palette.DARK_GREEN};
   }
`;

const Form = styled.div`
   width: 80%;

   @media only screen and (min-width: 600px) {
      width: 400px;
   }

   ul{
      list-style:none;
      padding:0;
      margin:0;

      li{
         padding: 5px 0;
         margin-bottom: 10px;
         position: relative;
      }

      input{
         background: transparent;
         color: #fff;
         font-size: ${palette.FONTSIZE_S};
         line-height: 25px;
         border: none;
         box-sizing: border-box;
         -webkit-box-sizing: border-box;
         -moz-box-sizing: border-box;
         outline: none;

         ::placeholder{
            color: #ffffff90;
         }
      }

      textarea{
         width: calc(100% - 10px);
         background: transparent;
         color: #fff;
         border: 1px solid ${palette.DARK_GREEN};
         border-radius: 3px;
         padding: 5px;
         font-size: ${palette.FONTSIZE_XS};
         line-height: 15px;
         overflow: scroll;
         resize: none;

         ::placeholder{
            color: #ffffff90;
         }
      }

      select {
         color: ${palette.DARK_GREEN};
         background-color: ${palette.LIGHT_GREEN};
         border: 1px solid ${palette.DARK_GREEN};
         border-radius: 3px;
         padding: 0.35em 1.5em 0.35em 0.5em;
         outline: 0;
      }
   }

   h4{
      margin-bottom: 10px;
      color: ${palette.LIGHT_GREEN};
   }

   .inlineInfo{
         display: flex;
         flex-wrap: wrap;
         justify-content: space-between;
   }

   .lineBorderFull{
      border-bottom: 1px solid ${palette.DARK_GREEN};
      width: 100%;
      display: block;
   }

   .lineBorder{
      border-bottom: 1px solid ${palette.DARK_GREEN};
      width: 45%;
   }

   #preview{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      border: 1px dashed #00000050;
      border-radius: 3px;
      padding: 10px;
      margin-bottom: 10px;
      
      img{
         width: 80px;
         height: 80px;
         margin: 5px;
      }
   }

   .form-input{
      width: 100%;
      margin: 0 auto;
      position: relative;

      input{
         display: none;
      }

      label{
         position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 35px;
         display: flex;
         align-items: center;
         justify-content: center;
         color: ${palette.LIGHT_GREEN};
         font-size: 40px;
         cursor: pointer;
      }

   }

   .prepare-img-btn{
      position: absolute;
         bottom: 16px;
         right: 0;
      width: 160px;
      background: ${palette.DARK_GREEN};
      color: ${palette.LIGHT_GREEN};
      border: none;
      border-radius: 0 0 3px 0;
      margin: 0 auto;
      padding: 5px;
      font-size: ${palette.FONTSIZE_XS};
      font-weight: lighter;
      opacity: 0.7;
      text-decoration: none;
      cursor: pointer;
      z-index: 10;
   }
`;

const Checkboxes = styled.div`
   position: relative;
   display: flex;
   justify-content: space-between;
   padding: 5px 0;

   label{
      position: relative;
      display: flex; 
      justify-content: space-between;
      margin: 0 3px;
      text-align: center;
      
      input[type="radio"]{
         position: absolute;
         opacity: 0;
         cursor: pointer;
      }
   }

   .icon-box{
      width: 20px;
      height: 20px;
      background: transparent;
      border-radius: 5px;
      padding: 3px;
      box-shadow: -1px -1px 3px rgba(255,255,255,0.5), 
                  1px 1px 4px rgba(17,73,59,0.7),
                  inset 0 0 5px rgba(17,73,59,0.4);
   }

   label input[type="radio"]:checked ~ .icon-box{
      box-shadow: inset -2px -2px 5px rgba(255,255,255,0.5), 
                  inset 1px 1px 4px rgba(17,73,59,0.7);
   }
`;

const DisabledBtn = styled.button`
   width: 100%;
   background: #d8d8d8c0;
   color: #ffffff80;
   padding: 0.7rem;
   margin-bottom: 5rem;
   border: none;
   border-radius: 5px;
   text-decoration: none;
   cursor: not-allowed;
`;

const AddPlantBtn = styled.button`
   width: 100%;
   background: ${palette.LIGHT_GREEN};
   color: ${palette.DARK_GREEN};
   padding: 0.7rem;
   margin-bottom: 5rem;
   border: none;
   border-radius: 5px;
   font-weight: bold;
   text-decoration: none;
   cursor: pointer;
`;

export default AddPlant;
