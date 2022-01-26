import React, { useContext, useState, createContext, useEffect } from "react";

import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase-config";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
   let navigate = useNavigate();
   const [user, setUser] = useState("")

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

   return (
      <userAuthContext.Provider value={{
         signInWithGoogle, 
         signUserOut, 
         user
      }}>
         { children }
      </userAuthContext.Provider>
   )
}

export function useUserAuth() {
   return useContext(userAuthContext);
}