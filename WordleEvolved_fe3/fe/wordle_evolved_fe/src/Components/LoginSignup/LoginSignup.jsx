import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import password_icon from '../Assets/password.png';
import email_icon from '../Assets/email.png';
import { decodeToken } from 'react-jwt';

const LoginSignup = () => {
    const [action, setAction] = useState('Sign Up');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Get the navigate function using useNavigate()

    localStorage.setItem('triedWords',JSON.stringify([]))

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://localhost:7020/api/Authentication/login', {
                userName: username,
                password: password
            });
    
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);

                const decodedToken = decodeToken(response.data.token);

                localStorage.setItem('UserId', decodedToken.UserId);

                console.log('User statistics response:', localStorage.getItem('UserId'));

                const statsResponse = await axios.get(`https://localhost:7020/api/UserStatistics/user/${decodedToken.UserId}`);
                if (statsResponse.status === 200) {
                    console.log('User statistics response:', statsResponse.data); // Log the user statistics response

                    // Save the statistic ID in the local storage
                    localStorage.setItem('statisticId', statsResponse.data.statisticId);
                }

                navigate('/welcome', { state: { username: username } });
            } else {
                // Unexpected response status
                setErrorMessage('An error occurred while logging in');
            }
        } catch (error) {
            // Handle error here
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid username or password');
            } else {
                // Network errors or other issues
                setErrorMessage('An error occurred while logging in');
            }
        }
    };

    const validatePassword = (password) => {
        let errors = [];
        if (action === "Sign Up"){
            if (password.length < 6) {
                errors.push('Passwords must be at least 6 characters.\n');
            }
            if (!/\W/.test(password)) {
                errors.push('Passwords must have at least one non alphanumeric character.\n');
            }
            if (!/\d/.test(password)) {
                errors.push('Passwords must have at least one digit (\'0\'-\'9\').\n');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Passwords must have at least one uppercase (\'A\'-\'Z\').\n');
            }
        }
        return errors;
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        const passwordErrors = validatePassword(e.target.value);
        if (passwordErrors.length > 0) {
            // Format the error messages with bullet points and newlines
            setErrorMessage(passwordErrors.map(error => `• ${error}`).join('\n'));
        } else {
            setErrorMessage('');
        }
    };

    const handleSignup = async () => {
        let error = '';
    
        if (!username) {
            error = 'Username field must not be empty';
        } else if (!email) {
            error = 'Email field must not be empty';
        } else if (password !== repeatPassword) {
            error = 'Passwords do not match';
        } else {
            const passwordErrors = validatePassword(password);
            if (passwordErrors.length > 0) {
                error = passwordErrors.join('\n');
            }
        }
    
        setErrorMessage(error); // Set the error message
    
        if (!error) {
            // Proceed with signup only if there are no errors
            try {
                const response = await axios.post('https://localhost:7020/api/Authentication/register', {
                    UserName: username,
                    Email: email,
                    Password: password
                });
    
                if (response.status === 200) {
                    localStorage.setItem('token', response.data.token);
                    setIsLoggedIn(true);

                    const decodedToken = decodeToken(response.data.token);

                    localStorage.setItem('UserId', decodedToken.UserId);

                    console.log('User statistics response:', localStorage.getItem('UserId'));

                    const statsResponse = await axios.get(`https://localhost:7020/api/UserStatistics/user/${decodedToken.UserId}`);
                    if (statsResponse.status === 200) {
                        console.log('User statistics response:', statsResponse.data); // Log the user statistics response

                        // Save the statistic ID in the local storage
                        localStorage.setItem('statisticId', statsResponse.data.statisticId);
                    }
                    
                    navigate('/welcome', { state: { username: username } });
                } else {
                    // Handle error here
                    console.log('Error registering');
                }
            } catch (error) {
                // Handle error here
                console.log('Error registering', error);
            }
        }
    };

    return (
        <div className =  'container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="user_icon" className="icon"/>
                    <input type="text" placeholder="Username" className="input_field" onChange={e => setUsername(e.target.value)} value={username} key={action} />
                </div>
                {action === "Login"?<div></div>:<div className="input">
                    <img src={email_icon} alt="email_icon" className="icon"/>
                    <input type="text" placeholder="Email" className="input_field" onChange={e => setEmail(e.target.value)} value={email} key={action}/>
                </div>}
                <div className="input">
                    <img src={password_icon} alt="password_icon" className="icon"/>
                    <input type="password" placeholder="Password" className="input_field" onChange={handlePasswordChange} value={password} key={action} />
                </div>
                {action === "Login"?<div></div>:<div className="input">
                    <img src={password_icon} alt="password_icon" className="icon"/>
                    <input type="password" placeholder="Repeat Password" className="input_field" onChange={e => setRepeatPassword(e.target.value)} value={repeatPassword} key={action} />
                </div>}
                {action === "Sign Up"?<div></div>:<div className = "forgot-password">Forgot Password? <span> Click here! </span></div> }
                {errorMessage && <pre className="error">{errorMessage}</pre>}
                <div className = "submit-container">
                    <div className = {action === "Login"?"submit gray":"submit"} onClick={()=>{
                        if (action === "Sign Up") {
                            handleSignup();
                        }
                        else
                        {
                            setAction("Sign Up");
                            setUsername('');
                            setPassword('');
                            setEmail('');
                            setErrorMessage('');
                        }
                        }}>Sign Up</div>
                    <div className = {action === "Sign Up"?"submit gray":"submit"} onClick={() => {
                        if (action === "Login") {
                            handleLogin();
                        }
                        else
                        {
                            setAction("Login");
                            setUsername('');
                            setPassword('');
                            setEmail('');
                            setErrorMessage('');
                        }
                    }}>Login</div>
                </div>
            </div>
        </div>
    );
}


export default LoginSignup;