import React, { useState } from 'react';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import '../styles.css';
import { Button, TextField, Box, Container, Input, IconButton } from '@mui/material';
import Loading from '../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

export default function SigninPage({ onCloseSigninPage }) {
    const [phoneNumber, setPhoneNumber] = useState();
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState();
    const [isLoading, setIsLoading] = useState(false);

    async function signInHandler() {
        const auth = getAuth();
        auth.settings.appVerificationDisabledForTesting = true;
        const recaptchaVerifier = new RecaptchaVerifier(
            'sign-in-button',
            {
                size: 'invisible',
            },
            auth
        );
        setIsLoading(true);
        signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
            .then(confirmationResult => {
                toast.success('sent verification code to the given phone number', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
                setIsMessageSent(true);
                window.confirmationResult = confirmationResult;
            })
            .catch(error =>
                toast.error('unable to send verification code to the given phone number', {
                    position: toast.POSITION.BOTTOM_LEFT,
                })
            )
            .finally(() => setIsLoading(false));
    }

    function codeConfirmedHandler() {
        setIsLoading(true);
        window.confirmationResult
            .confirm(verificationCode)
            .then(result => {
                const userId = result.user.uid;
                toast.success('login succesful', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
                onCloseSigninPage(userId, phoneNumber);
            })
            .catch(error =>
                toast.error('unable to login', {
                    position: toast.POSITION.BOTTOM_LEFT,
                })
            )
            .finally(() => setIsLoading(false));
    }

    function getLoginOrSignUpPage() {
        return (
            <>
                {/* <div class="line-decoration"></div> */}
                <h3 class="section-style">Login or Signup</h3>
                <PhoneInput
                    class="section-style"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                />
                <Button class="botton-style" id="sign-in-button" variant="contained" onClick={signInHandler}>
                    Continue
                </Button>
            </>
        );
    }

    function getCodeVerificationPage() {
        return (
            <>
                <h3 class="section-style">Enter Verification Code</h3>
                <TextField
                    sx={{ mb: 6 }}
                    class="section-style"
                    hiddenLabel
                    fullWidth
                    size="medium"
                    onChange={event => setVerificationCode(event.target.value)}
                />
                <Button class="botton-style" id="sign-in-button" variant="contained" onClick={codeConfirmedHandler}>
                    Confirm
                </Button>
            </>
        );
    }

    return (
        <Container maxWidth="lg">
            {/* <Box display="flex" justifyContent="flex-end" mt={4}>
                <Input placeholder="Enter code" inputProps={{ 'aria-label': 'search google maps' }} />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SendIcon />
                </IconButton>
            </Box> */}
            <Box>
                <div className="center-container">
                    <div className="input-container">
                        <h3 class="title-style">Todo List</h3>
                        {isMessageSent ? getCodeVerificationPage() : getLoginOrSignUpPage()}
                    </div>
                </div>
            </Box>
            <ToastContainer />
            <Loading isModalOpen={isLoading} />
        </Container>
    );
}
