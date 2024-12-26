import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import axios from "axios";
import {auth} from "../firebase.js"
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
const Signin = () => {
  useEffect(()=>{
    if(Cookies.get("email")){
      navigate("/");
    }
  },[])
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [error,setError]=useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    try {
      // Simulated backend call
      const userCredential=await signInWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log("User is verified and signed in successfully.");
        const res = await axios.post("https://connect-aawd.onrender.com/api/auth/signin", {
          email: formState.email,
          password: formState.password,
        });
        if(res.data.message=="Sign in success"){
          Cookies.set('email', result.user.email, { expires: 7 })
          navigate("/");
        }
        else if(res.data.message=="User not found"){
          setError("User not Found");
        }
      } else if(!user.emailVerified) {
        alert("Email is not verified. Please verify your email first.");
        // Optionally, sign the user out immediately after checking
        auth.signOut();
        return false; // Email not verified, prevent sign-in
      }
    } catch (error) {

      console.error("Sign-in error:",error);
    }
  };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await axios.post("https://connect-aawd.onrender.com/api/auth/google", {
        email: result.user.email,
      });

      if (res.data.verified) {
        Cookies.set('email', result.user.email, { expires: 7 }); // Store email in cookies for 7 days
        navigate("/");
      }
    }catch (error) {
      console.error("Google sign-in error:", error);
      console.log(error.response.data.message);
      setError(error.response.data.message)
    }
  };
  return (
    <Container>
      <BackgroundAnimation />
      <SignInBox>
        <Title>Welcome Back 1!</Title>
        <Subtitle>Sign in to your account</Subtitle>
        {error?<p>{error}</p>:<p></p>}
        <Form onSubmit={handleSignIn}>
          <Input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <PasswordContainer>
            <PasswordInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formState.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            <ToggleIcon onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </ToggleIcon>
          </PasswordContainer>
          <Button type="submit">Sign In</Button>
        </Form>
        <OrDivider>or</OrDivider>
        <GoogleButton onClick={handleGoogleClick}>
          <FaGoogle /> Sign in with Google
        </GoogleButton>
        <Noaccount><span>Don't have an account ?</span><Link id='signup' to="/signup"> Signup</Link></Noaccount>
      </SignInBox>
    </Container>
  );
};

export default Signin;


// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const moveBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
  overflow: hidden;
  position: relative;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  background-size: 400% 400%;
  animation: ${moveBackground} 10s ease-in-out infinite;
  z-index: 1;
  opacity: 0.4;
`;

const SignInBox = styled.div`
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  padding: 2em;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  margin: 0 0 0.5em;
  font-size: 2em;
  color: #2193b0;
`;

const Subtitle = styled.p`
  font-size: 1.1em;
  color: #333;
  margin-bottom: 1.5em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 94%;
  padding: 0.75em;
  margin: 0.5em 0;
  border: none;
  border-radius: 4px;
  background: #f1f1f1;
  font-size: 1em;

  &:focus {
    outline: none;
    background: #e9e9e9;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0.5em 0;
`;

const PasswordInput = styled(Input)`
  padding-right: 2.5em;
  
`;

const ToggleIcon = styled.div`
  position: absolute;
  right: 0.5em;
  cursor: pointer;
  color: #2193b0;
  font-size: 1.2em;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75em;
  background: #2193b0;
  color: white;
  font-size: 1.1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1a7692;
  }
`;

const OrDivider = styled.p`
  margin: 1em 0;
  font-size: 1em;
  color: #777;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75em;
  background: #db4437; /* Google red */
  color: white;
  font-size: 1.1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #c13528;
  }

  svg {
    margin-right: 0.5em;
  }
`;
const Noaccount=styled.div`
  float: right;
  margin-top: 10px;
  color: #2193b0;
  span{
    color:black;
  }
  #signup{
    color: #2193b0;
    text-decoration: none;
  }
`
