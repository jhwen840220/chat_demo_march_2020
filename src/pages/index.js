import React from 'react'
const { useState } = React
import { withRouter, Link } from "react-router-dom";
import styled from '@emotion/styled';
import { Zoom, Button, InputLabel, Input, InputAdornment } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons'
const Homepage = (props) => {

  const { history } = props;
  const [name, setName] = useState("");

  const handleChangeName = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('name', name)
    history.push("/chat");
    return;
  }

  return (
    <HomepageContainer>
      <Container className="container">
        {/* <Link to={`/chat`}>chat</Link> */}
        <Zoom in={true}>
          <h1 className="homepage-title">Welcome to Chat!</h1>
        </Zoom>
        <SubmitForm onSubmit={handleSubmit}>
          <div className="input-block">
            <InputLabel htmlFor="input-name">Please enter your name</InputLabel>
            <Input
              id="input-name"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              value={name}
              onChange={handleChangeName}
            />
          </div>
          <Button type="submit" variant="contained" color="secondary">Submit</Button>
        </SubmitForm>
      </Container>
    </HomepageContainer>
  )
}

export default withRouter(Homepage)


const HomepageContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  display: flex;
  align-items: center;
  height: 100%;
`;


const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .homepage-title {
    @media (max-width: 768px) {
      font-size: 30px;
    }
  }
`

const SubmitForm = styled.form`
  display: flex;
  flex-direction: column;
  .input-block {
    margin-bottom: 15px;
  }
`