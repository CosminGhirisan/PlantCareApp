import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./globalStyles";
import { UserAuthContextProvider } from "./userAuthContext";
import Navbar from "./Navbar/Navbar"
import Main from "./Pages/Main"
import Login from "./Pages/Login"
import AddNewPlant from "./Pages/AddNewPlant"
import UserProfile from "./Pages/UserProfile"
import Plant from "./Pages/Plant"
import ProtectedRoute from "./Components/ProtectedRoute";
import Construction from "./Components/Construction";


function App() {
  return (
    <Container>
      <GlobalStyle /> {/*import Global Styles to the App*/}
      <div className="underConstruction"><Construction /></div>
      <UserAuthContextProvider>
        <Navbar />
        <Routes>
          <Route exact path="/" element={ 
            <ProtectedRoute>
              <Main />
            </ProtectedRoute> 
          }/>
          <Route path="/login" element={ <Login />}/>
          <Route path="/add-new-plant" element={ 
            <ProtectedRoute>
              <AddNewPlant />
            </ProtectedRoute>
          }/>
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }/>
          <Route path=":plantId" element={
            <ProtectedRoute>
              <Plant />
            </ProtectedRoute>
          }/>
        </Routes>
      </UserAuthContextProvider>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;

  .underConstruction{
    position: fixed;
    top: 0;
    width: 100%;
    color: #fff;
    background-color: #ff0000;
    padding: 3px 0;
    text-align: center;
    z-index: 999;
  }
`;

export default App;
