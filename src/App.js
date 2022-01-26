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


function App() {
  return (
    <Container>
      <GlobalStyle /> {/*import Global Styles to the App*/}
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
`;

export default App;
