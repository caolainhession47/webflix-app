import React from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";

function ReviewsComp() {
  return (
    <StyledContainer>
      <h2 className="title">Reviews</h2>
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)`
  margin-top: 3rem;
  .title {
    color: white;
    margin-bottom: 12px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
  }
  .title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -5px;
    margin-bottom: auto.5rem;
    width: 8.3rem;
    height: 5px;
    background-color: #e82128;
  }
`;

export default ReviewsComp;
