import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pizza } from '../../types/Pizza';
import FileInput from "../../components/FileInput"


interface PizzaModalProps {
    isOpen: boolean;
    pizzaToEdit: Pizza | null;
    onClose: () => void;
}

const AdminPizzaCreateEdit: React.FC<PizzaModalProps> = ({ isOpen, onClose, pizzaToEdit }) => {

    const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;
    const [submitting, setSubmitting] = useState(false);

    const [pizzaName, setPizzaName] = useState<string>('');
    const [pizzaNameTouched, setPizzaNameTouched] = useState(false);

    const [pizzaNumber, setPizzaNumber] = useState<string>('');
    const [pizzaNumberTouched, setPizzaNumberTouched] = useState(false);

    const [pizzaDescription, setPizzaDescription] = useState<string>('');
    const [pizzaDescriptionTouched, setPizzaDescriptionTouched] = useState(false);

    const [pizzaPriceBeforeDiscount, setPizzaPriceBeforeDiscount] = useState<string>('');
    const [pizzaPriceBeforeDiscountTouched, setPizzaPriceBeforeDiscountTouched] = useState(false);

    const [pizzaDiscountPercentage, setPizzaDiscountPercentage] = useState<string>('');

    const [pizzaDiscountPercentageTouched, setPizzaDiscountPercentageTouched] = useState(false);

    const [pizzaPriceAfterDiscount, setPizzaPriceAfterDiscount] = useState<string>('');
    const [pizzaPriceAfterDiscountTouched, setPizzaPriceAfterDiscountTouched] = useState(false);

    const [pizzaImageurl, setPizzaImageurl] = useState<string>('');
    const [pizzaImageurlTouched, setImageurlTouchedTouched] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [submitError, setSubmitError] = useState<string>('');



    const isPizzaNameValid = pizzaName.length > 0;
    const isPizzaNumberValid = pizzaNumber.length > 0;
    const isPizzaDescriptionValid = pizzaDescription.length > 0;
    const isPriceBeforeDiscountValid = true // !isNaN(pizzaPriceBeforeDiscount)
    const isPizzaDiscountValid = true // !isNaN(pizzaPriceBeforeDiscount)
    const isPriceAfterDiscountValid = true // !isNaN(pizzaPriceBeforeDiscount)
    const isImageurlValid = pizzaImageurl.length > 0;
    const isFormValid = isPizzaNameValid && isPizzaNumberValid && isPizzaDescriptionValid && isPriceBeforeDiscountValid && isPizzaDiscountValid && isPriceAfterDiscountValid


    useEffect(() => {
        if (!isOpen) return;

        if (pizzaToEdit !== null) {
            setPizzaName(pizzaToEdit.name);
            setPizzaNumber(pizzaToEdit.pizzanumber)
            setPizzaDescription(pizzaToEdit.description)
            setPizzaPriceBeforeDiscount(pizzaToEdit.discountprice.toFixed(2))
            setPizzaDiscountPercentage(pizzaToEdit.discountpercentage.toFixed(1))
            setPizzaPriceAfterDiscount(pizzaToEdit.price.toFixed(2))
            setPizzaImageurl(pizzaToEdit.imageurl)

        }
        else {
            setPizzaName('');
            setPizzaNumber('')
            setPizzaDescription('')
            setPizzaPriceBeforeDiscount('')
            setPizzaDiscountPercentage('')
            setPizzaPriceAfterDiscount('')
            setPizzaImageurl('')
            setSelectedFile(null)


        }

        setPizzaNameTouched(false)
        setPizzaNumberTouched(false)
        setPizzaDescriptionTouched(false)
        setPizzaPriceBeforeDiscountTouched(false)
        setPizzaDiscountPercentageTouched(false)
        setPizzaPriceAfterDiscountTouched(false)
        setImageurlTouchedTouched(false)

        setSubmitting(false);

    }, [isOpen]);



    const handleSubmit = async () => {

        if (!isFormValid) {
            return;
        }

        const pizzaData = {
            id: pizzaToEdit !== null ? pizzaToEdit.id : 0,
            name: pizzaName,
            pizzanumber: pizzaNumber,
            description: pizzaDescription,
            imageurl: pizzaImageurl,
            price: pizzaPriceAfterDiscount.replaceAll(',', '.'),
            discountpercentage: pizzaDiscountPercentage.replaceAll(',', '.'),
            discountprice: pizzaPriceBeforeDiscount.replaceAll(',', '.'),
            producttype: 0
        }

        if (selectedFile) {
            await handleUpload();
        }
        const url = webApiBaseUrl + '/Admin/addorupdatepizza'
        try {
            const response = await axios.post(url, pizzaData);
            onClose();
        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);
        } finally {
            setSubmitting(false);
        }

    };

    /* const handlePriceBeforeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === '') {
            setPizzaPriceBeforeDiscount('');
        } else {
            const parsedValue = parseFloat(newValue);
            if (!isNaN(parsedValue)) {
                let fixedWith2Decimals = parsedValue.toFixed(2);
                let finalNumber = parseFloat(fixedWith2Decimals);
                setPizzaPriceBeforeDiscount(finalNumber);
            }
        }
    }; */

    const handlePriceBeforeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replaceAll(',', '.');
        if (newValue === '') {
            setPizzaPriceBeforeDiscount('');
        } else {

            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                return;
            }
            setPizzaPriceBeforeDiscount(newValue);
            setPizzaPriceBeforeDiscountTouched(true);
        }
    };

    const handleOnBlurPriceBeforeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        if (newValue === '') {
            setPizzaPriceBeforeDiscount('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setPizzaPriceBeforeDiscount('0,00');
                return;
            }

            let newValueAsString = newValueAsNumber.toFixed(2);
            newValueAsString = newValueAsString.replaceAll('.', ',');

            setPizzaPriceBeforeDiscount(newValueAsString);
        }
    };

    const handleDiscountPercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
        //const newValue = e.target.value.replaceAll(',', '.');
        const inputValue = e.target.value;
       
        
            if (inputValue === '') {
               setPizzaDiscountPercentage('');
           } else {
               //const parsedValue = parseFloat(newValue);
               var normalizeNumber = inputValue.replaceAll(',', '.');
               let newValueAsNumber = Number(normalizeNumber);
               if (isNaN(newValueAsNumber)) {
                   return;
               }
   
               let fixedWith1Decimals = newValueAsNumber.toString().replaceAll('.', ',');
               setPizzaDiscountPercentage(fixedWith1Decimals);
           } 

               /*  const normalizedValue = inputValue.replace(',', '.');
                setPizzaDiscountPercentage(normalizedValue); */
    };

    const handleOnBlurDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        /* if (newValue === '') {
            setPizzaDiscountPercentage('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setPizzaPriceAfterDiscount('0,00');
                setPizzaPriceBeforeDiscount(pizzaPriceAfterDiscount)
                return;
            }

            let newValueAsString = newValueAsNumber.toFixed(1);
            newValueAsString = newValueAsString.replaceAll('.', ',');

            //if (pizzaDiscountPercentage) {
            let pizzaPriceAfterDiscountNumber = 0;
            if (pizzaPriceAfterDiscount) {
                pizzaPriceAfterDiscountNumber = Number(pizzaPriceAfterDiscount.replaceAll(',', '.'))
            }

            let tmpVal = (newValueAsNumber * pizzaPriceAfterDiscountNumber) / 100
            let tmpVal1 = pizzaPriceAfterDiscountNumber + tmpVal;
            let PriceBeforeDiscountAsString = tmpVal1.toFixed(2).replaceAll('.', ',');
            setPizzaPriceBeforeDiscount(PriceBeforeDiscountAsString);
            //   }
            //  else {
            // setPizzaPriceBeforeDiscount(newValueAsString);
            //  }

            setPizzaDiscountPercentage(newValueAsString);
        } */
    };

    const handlePriceAfterDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.replaceAll(',', '.');
        if (newValue === '') {
            setPizzaPriceAfterDiscount('');
        } else {

            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                return;
            }

            /* 
                    if (pizzaDiscountPercentage)
                    {
                        let tmpVal = (newValueAsNumber * pizzaDiscountPercentage) / 100
                        let tmpVal1 = newValueAsNumber - tmpVal;
                        newValue = tmpVal1.toString().replaceAll('.', ',');;
                    } */
            setPizzaPriceAfterDiscount(newValue);
            setPizzaPriceAfterDiscountTouched(true);
        }
    };

    const handleOnBlurPriceAfterDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        if (newValue === '') {
            setPizzaPriceAfterDiscount('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setPizzaPriceAfterDiscount('0,00');

                return;
            }

            let newValueAsString = newValueAsNumber.toFixed(2);
            newValueAsString = newValueAsString.replaceAll('.', ',');

            if (pizzaDiscountPercentage) {
                let pizzaDiscountPercentageNumber = 0;
                pizzaDiscountPercentageNumber = Number(pizzaDiscountPercentage.replaceAll(',', '.'))

                let tmpVal = (newValueAsNumber * pizzaDiscountPercentageNumber) / 100
                let tmpVal1 = newValueAsNumber - tmpVal;
                let PriceBeforeDiscountAsString = tmpVal1.toFixed(2).replaceAll('.', ',');;
                setPizzaPriceBeforeDiscount(PriceBeforeDiscountAsString);
            }
            else {
                setPizzaPriceBeforeDiscount(newValueAsString);
            }

            setPizzaPriceAfterDiscount(newValueAsString);
        }
    };


    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const url = webApiBaseUrl + '/Admin/upload'
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (typeof response.data.imageUrl === 'string') {
                setPizzaImageurl(response.data.imageUrl)
                setImageurlTouchedTouched(true);
            }

            else {
                setPizzaImageurl('/Uploads/dummy.png')
                setImageurlTouchedTouched(true);
            }

            console.log('Upload success:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFileSelect = (file: File) => {
        console.log("Parent got file:", file);
        setSelectedFile(file);
        setPizzaImageurl('/Uploads/' + file.name)
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
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px' }} >Pizza</h2>


                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: '200' }}>
                    <label htmlFor="pizzanumber">Pizzanummer:</label><br />
                    <input
                        id="pizzanumber"
                        type="text"
                        value={pizzaNumber}
                        onChange={(e) => setPizzaNumber(e.target.value)}
                        onBlur={() => setPizzaNumberTouched(true)}
                        placeholder="Pizzanummer"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPizzaNumberValid && pizzaNumberTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="pizzaname">Pizzanavn:</label><br />
                    <input
                        id="pizzaname"
                        type="text"
                        value={pizzaName}
                        onChange={(e) => setPizzaName(e.target.value)}
                        onBlur={() => setPizzaNameTouched(true)}


                        placeholder="Pizzanavn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPizzaNameValid && pizzaNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="pizzadescription">Beskrivelse:</label><br />
                    <input
                        id="pizzadescription"
                        type="text"
                        value={pizzaDescription}
                        onChange={(e) => setPizzaDescription(e.target.value)}
                        onBlur={() => setPizzaDescriptionTouched(true)}
                        placeholder="Pizzabeskrivelse"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPizzaDescriptionValid && pizzaDescriptionTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="pricebeforediscount">Pris før rabat:</label><br />
                    <input
                        id="pricebeforediscount"
                        type="text"
                        // readOnly
                        value={pizzaPriceBeforeDiscount.replaceAll('.', ',')}
                        onChange={handlePriceBeforeDiscount}
                        onBlur={handleOnBlurPriceBeforeDiscount}
                        placeholder="Vejl. udsalgspris"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPriceBeforeDiscountValid && pizzaPriceBeforeDiscountTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="xyz">Rabat i %:</label><br />
                    <input
                        id="xyz"
                        type="text"
                        value={pizzaDiscountPercentage.replaceAll('.', ',')}
                        //value={pizzaDiscountPercentage}
                        onChange={handleDiscountPercentage}
                        /* onBlur={handleOnBlurDiscount} */
                        placeholder="Rabat i %"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPizzaDiscountValid && pizzaDiscountPercentageTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>
                <div style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 200 }}>
                    <label htmlFor="priceafterdiscount">Pris efter rabat:</label><br />
                    <input
                        id="priceafterdiscount"
                        type="text"
                        value={pizzaPriceAfterDiscount.replaceAll('.', ',')}
                        onChange={handlePriceAfterDiscount}
                        onBlur={handleOnBlurPriceAfterDiscount}
                        placeholder="Vejl. udsalgspris"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPriceAfterDiscountValid && pizzaPriceAfterDiscountTouched ? 'red' : undefined,
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
                            src={webApiBaseUrl + pizzaImageurl}
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
                </div>                {/*  <input
                        type="file"
                       
                        onChange={handleImageFileChange}
                    /> */}
                {/* <button
                        onClick={handleUpload}
                        disabled={false}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#8d4a5b',
                            // backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                            marginRight: '0.5rem',
                        }}
                    >
                        Upload billede
                    </button> */}


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

export default AdminPizzaCreateEdit