import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./globalStyles";
import Navbar from "./Navbar/Navbar"
import Main from "./Pages/Main"
import Login from "./Pages/Login"
import AddNewPlant from "./Pages/AddNewPlant"
import UserProfile from "./Pages/UserProfile"
import Plant from "./Pages/Plant"


function App() {
  return (
    <Container>
      <GlobalStyle /> {/*import Global Styles to the App*/}
      <Navbar />
      <Routes>
        <Route exact path="/" element={ <Main />}/>
        <Route path="/login" element={ <Login />}/>
        <Route path="/add-new-plant" element={<AddNewPlant />}/>
        <Route path="/user-profile" element={<UserProfile />}/>
        <Route path=":plantId" element={<Plant />}/>
      </Routes>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
`;

export default App;
