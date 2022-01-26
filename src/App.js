import styled from "styled-components";

import GlobalStyle from "./globalStyles";
import Navbar from "./Navbar/Navbar"

function App() {
  return (
    <Container>
      <GlobalStyle /> {/*import Global Styles to the App*/}
      <Navbar />

    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
`;

export default App;
