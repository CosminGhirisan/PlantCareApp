import React, { useContext, useState, createContext, useEffect, useRef } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";

import { auth, provider, db } from "./firebase-config";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
   let navigate = useNavigate();
   const [user, setUser] = useState("");
   const searchRefVal = useRef("")
   const [searchTerm, setSearchTerm] = useState("");
   const [plantsList, setPlantsList] = useState([]);
   const [plantsPerUser, setPlantsPerUser] = useState(0);
   const [loading, setLoading] = useState(true);
   const plantsCollectionRef = collection(db, "plants");

   const signInWithGoogle = () => {
      signInWithPopup(auth, provider).then((result) => {
         localStorage.setItem("isAuth", true);
         navigate("/");
      })
   }

   const signUserOut = () => {
      signOut(auth).then(() => {
        localStorage.removeItem("isAuth");
        navigate("/login");
      })
   } 

   const handleDelete = async (id) => {
      const docRef = doc(db, "plants", id);
      await deleteDoc(docRef); // Remove the deleted plant from Firestore Database
      setPlantsList(plantsList.filter(el => el.id !== id)); // Remove the deleted plant from downloaded plantList array
      navigate("/user-profile");
   }

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         console.log("Check user auth - start");
         setUser(currentUser)
         console.log("Check user auth - end");
      });

      return () => unsubscribe();
   }, []);

   /* Get the plants data from firestore */
   useEffect(() => {
      const q = query(plantsCollectionRef, orderBy("timestamp", "desc"));
  
      const getPlants = async () => {
         const data = await getDocs(q);
         console.log("Get plants request - start");
         setPlantsList(data.docs.map((doc) => ({...doc.data(), id:doc.id})));
         setLoading(false);
         console.log("Get plants request - end");
      }

      getPlants();
   },[searchTerm]);

   /* Get the number of the plants Current User added */
   useEffect(() => {
      console.log("No of plants request - start");
      if(user) {
         setPlantsPerUser(plantsList.filter(x => x.author.id===user.uid).length);
      }
      console.log("No of plants request - end");
   },[user, plantsList])

   return (
      <userAuthContext.Provider value={{
         signInWithGoogle, 
         signUserOut, 
         user,
         handleDelete,
         loading,
         searchRefVal,
         searchTerm,
         setSearchTerm, 
         searchRefVal,
         plantsList,
         setPlantsList,
         plantsPerUser,
         setPlantsPerUser
      }}>
         { children }
      </userAuthContext.Provider>
   )
}

export function useUserAuth() {
   return useContext(userAuthContext);
}