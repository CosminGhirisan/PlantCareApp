import React, { useContext, useState, createContext, useEffect, useRef } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
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
   const [loading, setLoading] = useState(true)
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

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser)
      });

      return () => unsubscribe();
   }, []);

   {/* get back the plants data from firestore */}
   useEffect(() => {
      const q = query(plantsCollectionRef, orderBy("timestamp", "desc"))
  
      const getPlants = async () => {
         const data = await getDocs(q);
         setPlantsList(data.docs.map((doc) => ({...doc.data(), id:doc.id})));
         setLoading(false);
      }

      getPlants();     
   },[searchTerm]);

   useEffect(() => {
      if(user) {
         setPlantsPerUser(plantsList.filter(x => x.author.id===user.uid).length);
      }
   },[user, plantsList])

   return (
      <userAuthContext.Provider value={{
         signInWithGoogle, 
         signUserOut, 
         user,
         loading,
         searchRefVal,
         setSearchTerm, 
         searchRefVal,
         plantsList,
         searchTerm,
         plantsPerUser
      }}>
         { children }
      </userAuthContext.Provider>
   )
}

export function useUserAuth() {
   return useContext(userAuthContext);
}