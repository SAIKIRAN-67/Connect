import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithPopup,sendEmailVerification ,createUserWithEmailAndPassword} from 'firebase/auth';
import { app } from '../firebase.js';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 
const Signup = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const [isError, setIsError] = useState(false); // Add a state for error indication

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(''); // Clear previous response messages
    
    try {
      // Step 1: Create user with Firebase Authentication
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
  
      const user = userCredential.user;
  
      // Step 2: Send email verification
      await sendEmailVerification(user);
      console.log("Verification email sent.");
  
      // Step 3: Save user details in your backend if needed
      const res = await axios.post("https://connect-aawd.onrender.com/api/auth/signup", formState);
      console.log(res);
  
      if (res.data.message === "User Created successfully") {
        setResponseMessage(
          "Sign-up successful! Please check your email to verify your account."
        );
        setIsError(false); // Success message
      } else {
        setResponseMessage(res.data.message);
        setIsError(true); // Error message
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setResponseMessage("Sign-up error. Please try again.");
      setIsError(true); // Error message
    } finally {
      setLoading(false);
    }
  };
  function sendVerificationEmail(user) {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          console.log("Verification email sent.");
          alert("Verification email sent. Please check your inbox.");
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          alert(`Failed to send verification email: ${error.message}`);
        });
    } else {
      alert("No user is logged in.");
    }
  }
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
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Container>
      <BackgroundAnimation />
      <SignUpBox>
        <Title>Join Connect</Title>
        <Subtitle>Be part of your community</Subtitle>
        
        {responseMessage && <ResponseMessage isError={isError}>{responseMessage}</ResponseMessage>}
        <LoginOptions>
          <LoginButton 
            isSelected={selectedRole === 'citizen'}
            onClick={() => handleRoleSelect('citizen')}
          >
            Citizen SignUP
          </LoginButton>
          <LoginButton 
            isSelected={selectedRole === 'official'}
            onClick={() => handleRoleSelect('official')}
          >
            Higher Official SignUp
          </LoginButton>
        </LoginOptions>
        <Form onSubmit={handleSignUp}>
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
          <PasswordContainer>
            <PasswordInput
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formState.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
            />
            <ToggleIcon onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </ToggleIcon>
          </PasswordContainer>
          <Button type="submit" disabled={loading}>
            Sign Up
          </Button>
        </Form>
        <OrDivider>or</OrDivider>
        <GoogleButton onClick={handleGoogleClick}>
          <FaGoogle /> Sign up with Google
        </GoogleButton>
        <Noaccount><span>Have an account?</span><Link id='signup' to="/signin"> Signin</Link></Noaccount>
      </SignUpBox>
    </Container>
  );
};

export default Signup;

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

const SignUpBox = styled.div`
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

const ResponseMessage = styled.div`
  background-color: ${({ isError }) => (isError ? '#f8d7da' : '#dff0d8')}; // Red for errors, green for success
  color: ${({ isError }) => (isError ? '#a94442' : '#3c763d')}; // Red text for errors, green text for success
  padding: 0.5em;
  margin-bottom: 1em;
  border-radius: 4px;
  font-size: 1em;
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
  opacity: ${(props) => (props.disabled ? '0.7' : '1')};

  &:hover {
    background: ${(props) => (props.disabled ? '#2193b0' : '#1a7692')};
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

const Noaccount = styled.div`
  float: right;
  margin-top: 10px;
  color: #2193b0;

  span {
    color: black;
  }

  #signup {
    color: #2193b0;
    text-decoration: none;
  }
`;
const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
`;

const LoginButton = styled.button`
  flex: 1;
  padding: 0.75em;
  margin: 0 0.5em;
  background: ${({ isSelected }) => (isSelected ? '#28a745' : '#2d89ef')};
  color: white;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: ${({ isSelected }) => (isSelected ? '#218838' : '#1b5fc8')};
  }
`;