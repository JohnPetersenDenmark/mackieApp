import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SaleLocation } from '../../types/SaleLocation';

import AdminPlaceCreateEdit from "./AdminPlaceCreateEdit"


const AdminPlaces: React.FC = () => {

    const [locations, setLocations] = useState<SaleLocation[]>([]);
    const [isCreateEditLocationModalOpen, setIsCreateEditLocationModalOpen] = useState(false);
    const [locationToEdit, setLocationToEdit] = useState<SaleLocation | null>(null);
     const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const webApiBaseUrl = process.env.REACT_APP__BASE_API_URL;

    useEffect(() => {
        const url: string = webApiBaseUrl + '/Home/locationlist'

        axios.get<SaleLocation[]>(url)
            .then(response => {
                setLocations(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            });

    }, [isCreateEditLocationModalOpen , submitting]);

    const handleEdit = (location: SaleLocation) => {
        setLocationToEdit(location);
        setIsCreateEditLocationModalOpen(true);
    };

   const handleDelete = (location: SaleLocation) => {
    if (location !== null) {
        const deleteLocation = async () => {
            try {
                setSubmitting(true);
                const url = webApiBaseUrl + '/Admin/removelocation/' + location.id;
                await axios.delete(url);
            } catch (error) {
                setError('Fejl');
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        };

        deleteLocation();  // Call the inner async function
    }
};

    const handleNewLocation = () => {
        setIsCreateEditLocationModalOpen(true);
    };

    const handleCloseCreateEditPlaceModal = () => {
        setIsCreateEditLocationModalOpen(false);
    };

    return (
        <div>
            <AdminPlaceCreateEdit
                isOpen={isCreateEditLocationModalOpen}
                onClose={handleCloseCreateEditPlaceModal}
                locationToEdit={locationToEdit}
            />


            <div style={{
                border: '1px solid grey',
                padding: '10px', // optional: adds space inside the border
                borderRadius: '5px', // optional: rounded corners
                fontSize: '20px',
                color: '#22191b',
                fontWeight: 200,
                textAlign: 'center'

            }}>
                <div style={{
                    textAlign: 'center',
                    fontSize: '36px',

                }}>
                    Stadepladser
                </div>
                <div style={{
                    textAlign: 'left'
                }}>
                    <p>Herunder er liste med dine faste stadepladser.
                    </p>

                    <p>Du kan altid oprette nye stadepladser eller slette en stadeplads.
                    </p>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    {locations.map((curLocation, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ccc',    // Border around each row
                                padding: '10px',             // Optional: Adds spacing inside each row
                                marginBottom: '5px',         // Optional: Adds spacing between rows
                                display: 'grid',
                                gridTemplateColumns: '3fr 4fr 3fr 3fr', // Adjust column sizes as needed
                                alignItems: 'center'
                            }}
                        >
                            <div>Stade id.: {curLocation.id}</div>
                            <div>{curLocation.locationname}</div>
                            <div>
                                <button
                                    onClick={() => handleEdit(curLocation)}  // You'll define handleEdit below
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#8d4a5b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Rediger
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDelete(curLocation)}  // You'll define handleEdit below
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#8d4a5b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Slet
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <button
                        onClick={handleNewLocation}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#8d4a5b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Ny
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminPlaces;