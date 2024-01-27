import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const FullPageLoaderContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  z-index: 10;
  position: fixed;
`;

function FullPageLoader() {
  return (
    <FullPageLoaderContainer>
      <Spinner
        animation="border"
        role="status"
        variant="danger"
        style={{ width: "65px", height: "65px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </FullPageLoaderContainer>
  );
}

export default FullPageLoader;
