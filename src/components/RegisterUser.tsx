import React, { useEffect, useState } from 'react';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';
import { User } from '../types/User';

interface RegisterModalProps {
    isOpen: boolean;
    userToEdit: User | null;
    onClose: () => void;
}

const RegisterUser: React.FC<RegisterModalProps> = ({ isOpen, userToEdit, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [userName, setUserName] = useState<string>('');
    const [userNameTouched, setUserNameTouched] = useState(false);

    const [userId, setUserId] = useState<string>('');

    const [password, setPassword] = useState<string>('');
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [displayname, setDisplayName] = useState<string>('');
    const [displayNameTouched, setDisplayNameTouched] = useState(false)

    const [disablePasswordChangeable, setDisablePasswordChangeable] = useState(true);
    const [disableUsernameChangeable, setDisableUserNameChangeable] = useState(true);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isUserNameValid = emailRegex.test(userName);
    const isPasswordValid = password.length > 0;
    const isDisplayNameValid = displayname.length > 0;
    const isFormValid = isPasswordValid && isUserNameValid;

    useEffect(() => {
        if (!isOpen) return;

        if (userToEdit != null) {

            setUserId(userToEdit.id)

            setUserName(userToEdit.username);
            setDisableUserNameChangeable(true);

            setPassword('No no');
            setDisablePasswordChangeable(true);

            setDisplayName(userToEdit.displayname);

        }

        else {
            setUserName('');
            setDisableUserNameChangeable(false);

            setPassword('');
            setDisablePasswordChangeable(false);

            setDisplayName('');
        }

        setPasswordTouched(false);
        setUserNameTouched(false);
        setDisplayNameTouched(false);

        setSubmitting(false);
    }, [isOpen, userToEdit]);

    const handleSubmit = async () => {
        const userData = {
            id: userId,
            email: userName.trim(),
            displayname,
            password,
        };
        try {
            setSubmitting(true);

            let url = "";
            if (userToEdit == null) {
                url = '/Login/register'
            }
            else {
                url = '/Login/changedisplayname'
            }
            const response = await AxiosClientPost(url, userData, false);

            
           

        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);
        } finally {
            setSubmitting(false);
             onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#8d4a5b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
        >
            <div
                style={{
                    backgroundColor: '#c7a6ac',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '500px',
                    boxSizing: 'border-box',
                }}
            >
                <h2
                    style={{
                        backgroundColor: '#8d4a5b',
                        padding: '1rem',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                    }}
                >
                    Login
                </h2>

                {/* Email input */}
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="username"><strong>Bruger/Email:</strong></label><br />
                    <input
                        id="username"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onBlur={() => setUserNameTouched(true)}
                        placeholder="Indtast bruger/email"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isUserNameValid && userNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}
                        disabled={disableUsernameChangeable}
                    />
                </div>

                {/* Password input */}
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password"><strong>Kodeord:</strong></label><br />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setPasswordTouched(true)}
                        placeholder="Indtast kodeord"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPasswordValid && passwordTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}
                        disabled={disablePasswordChangeable}
                    />
                    {!isPasswordValid && passwordTouched && (
                        <p style={{ color: 'red', marginTop: '0.25rem' }}>Kodeordet skal angives</p>
                    )}
                </div>

                {/* display name input */}
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="displayname"><strong>Display name:</strong></label><br />
                    <input
                        id="displayname"
                        type="Text"
                        value={displayname}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onBlur={() => setDisplayNameTouched(true)}
                        placeholder="Indtast display name"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isDisplayNameValid && displayNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                        }}
                        disabled={submitting}
                    />
                    {!isDisplayNameValid && displayNameTouched && (
                        <p style={{ color: 'red', marginTop: '0.25rem' }}>Display name</p>
                    )}
                </div>

                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                            minWidth: '100px',
                        }}
                    >
                        Ok
                    </button>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: !submitting ? '#8d4a5b' : 'grey',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: !submitting ? 'pointer' : 'not-allowed',
                            minWidth: '100px',
                        }}
                    >
                        Annuller
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterUser;
