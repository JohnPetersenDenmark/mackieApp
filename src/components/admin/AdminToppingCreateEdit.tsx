import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Topping } from '../../types/Topping';
import FileInput from "../../components/FileInput"
import config from '../../config';
import {AxiosClientGet, AxiosClientPost} from '../../types/AxiosClient';


interface ToppingModalProps {
    isOpen: boolean;
    toppingToEdit: Topping | null;
    onClose: () => void;
}

const AdminToppingCreateEdit: React.FC<ToppingModalProps> = ({ isOpen, onClose, toppingToEdit }) => {


    const [submitting, setSubmitting] = useState(false);

    const [toppingName, setToppingName] = useState<string>('');
    const [toppingDescription, setToppingDescription] = useState<string>('');
    const [toppingPrice, setToppingPrice] = useState<string>('');

    const [submitError, setSubmitError] = useState<string>('');

    const [toppingNameTouched, setToppingNameTouched] = useState(false);
    const [toppingPriceTouched, setToppingPriceTouched] = useState(false);
    const [toppingDescriptionTouched, setToppingDescriptionTouched] = useState(false);

    const [toppingImageurl, setToppingImageurl] = useState<string>('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const isToppingNameValid = toppingName.length > 0;
    const isToppingPriceValid = true;
    const isToppingDescriptionValid = toppingDescription.length > 0;
    const isFormValid = isToppingNameValid

    useEffect(() => {
        if (!isOpen) return;

        if (toppingToEdit !== null) {
            setToppingName(toppingToEdit.name);
            setToppingDescription(toppingToEdit.description);
            setToppingImageurl(toppingToEdit.imageurl)
            setToppingPrice(toppingToEdit.price.toFixed(2))
        }
        else {
            setToppingName('');
            setToppingDescription('');
            setToppingImageurl('');
            setToppingPrice('');
        }

        setToppingNameTouched(false)

        setSubmitting(false);

    }, [isOpen]);

    const handleSubmit = async () => {
        const toppingData = {
            id: toppingToEdit !== null ? toppingToEdit.id : 0,
            name: toppingName,
            description: toppingDescription,
            imageurl: toppingImageurl,
            price: toppingPrice.replaceAll(',', '.'),
            producttype: 1
        }

       // const url = config.API_BASE_URL + '/Admin/addorupdatetopping'

        try {           
             await AxiosClientPost('/Admin/addorupdatetopping', toppingData, true)
            onClose();
        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);
        } finally {
            setSubmitting(false);
        }

    };

    const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replaceAll(',', '.');
        if (newValue === '') {
            setToppingPrice('');
        } else {

            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                return;
            }
            setToppingPrice(newValue);
            setToppingPriceTouched(true);
        }
    };

    const handleOnBlurPrice = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        if (newValue === '') {
            setToppingPrice('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setToppingPrice('0,00');
                return;
            }

            let newValueAsString = newValueAsNumber.toFixed(2);
            newValueAsString = newValueAsString.replaceAll('.', ',');

            setToppingPrice(newValueAsString);
        }
    };

    const handleFileSelect = (file: File) => {
        console.log("Parent got file:", file);
        setSelectedFile(file);
        setToppingImageurl('/Uploads/' + file.name)
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
            }}
        >

            <div style={{   backgroundColor: '#c7a6ac',
        padding: '1rem',
        borderRadius: '8px',
        minWidth: '300px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto', }}>
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px' }} >Topping</h2>


                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="toppingname">Toppingnavn:</label><br />
                    <input
                        id="toppingname"
                        type="text"
                        value={toppingName}
                        onChange={(e) => setToppingName(e.target.value)}
                        onBlur={() => setToppingNameTouched(true)}
                        placeholder="Toppingnavn"
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

                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="toppingdescription">Beskrivelse:</label><br />
                    <input
                        id="toppingdescription"
                        type="text"
                        value={toppingDescription}
                        onChange={(e) => setToppingDescription(e.target.value)}
                        onBlur={() => setToppingDescriptionTouched(true)}
                        placeholder="Toppingbeskrivelse"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isToppingDescriptionValid && toppingDescriptionTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>


                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="toppingprice">Pris:</label><br />
                    <input
                        id="toppingprice"
                        type="text"
                        // readOnly
                        value={toppingPrice.replaceAll('.', ',')}
                        onChange={handlePrice}
                        onBlur={handleOnBlurPrice}
                        placeholder="Vejl. udsalgspris"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isToppingPriceValid && toppingPriceTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>


                <div
                    style={{
                        marginBottom: '1rem',
                        display: 'flex',           // Makes children align horizontally
                        alignItems: 'center',      // Optional: Vertically centers items
                        gap: '1rem'                // Optional: Spacing between image and FileInput
                    }}
                >
                    <div>
                        <img
                            src={config.API_BASE_URL + toppingImageurl}
                            style={{
                                maxWidth: '200px',
                                height: 'auto',
                                marginTop: '5px'
                            }}
                        />
                    </div>

                    <div>
                        <FileInput onFileSelect={handleFileSelect} />
                    </div>
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