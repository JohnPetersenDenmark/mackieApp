import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Topping } from '../../types/Topping';


interface ToppingModalProps {
    isOpen: boolean;
    toppingToEdit: Topping | null;
    onClose: () => void;
}

const AdminToppingCreateEdit: React.FC<ToppingModalProps> = ({ isOpen, onClose, toppingToEdit }) => {

    const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;
    const [submitting, setSubmitting] = useState(false);

    const [toppingName, setToppingName] = useState<string>('');
    const [submitError, setSubmitError] = useState<string>('');

    const [toppingNameTouched, setToppingNameTouched] = useState(false);

    const isToppingNameValid = toppingName.length > 0;
    const isFormValid = isToppingNameValid

    useEffect(() => {
        if (!isOpen) return;

        if (toppingToEdit !== null) {
            setToppingName(toppingToEdit.name);
        }
        else {
            setToppingName('');
        }
        setToppingNameTouched(false)

        setSubmitting(false);

    }, [isOpen]);

    const handleSubmit = async () => {
        const toppingData = {
            id: toppingToEdit !== null ? toppingToEdit.id : 0,



        }
       
        const url = webApiBaseUrl + '/Admin/XXXXXXXXXXXXXXXXX'
        try {
            const response = await axios.post(url, toppingData);
            onClose();
        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);
        } finally {
            setSubmitting(false);
        }

    };

  if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#8d4a5b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >

            <div style={{ backgroundColor: '#c7a6ac', padding: '2rem', borderRadius: '8px', minWidth: '500px' }}>
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px' }} >Pladsnavn</h2>


                <div style={{ marginBottom: '1rem' }}>
                    {/* <label htmlFor="email"><strong>Pladsnavn:</strong></label><br /> */}
                    <input
                        id="placename"
                        type="text"
                        value={toppingName}
                        onChange={(e) => setToppingName(e.target.value)}
                        onBlur={() => setToppingNameTouched(true)}
                        placeholder="Indtast pladsnavn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isToppingNameValid && toppingNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Ok</button>


                <button
                    onClick={onClose}
                    disabled={submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Annuler</button>

            </div>
        </div>
    )

}

export default AdminToppingCreateEdit