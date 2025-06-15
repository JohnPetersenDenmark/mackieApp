
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TruckLocation } from '../../types/TruckLocation';
import config from '../../config';

import AdminCalendarCreateEdit from "./AdminCalendarCreateEdit"

interface AdminCalendarProps {
    isOpen: boolean;
    onClose: () => void;
}


const AdminCalendar: React.FC = () => {
    const [truckLocations, setTruckLocations] = useState<TruckLocation[]>([]);
    const [isCreateEditCalendarModalOpen, setIsCreateEditCalendarModalOpen] = useState(false);
    const [truckLocationToEdit, setTruckLocationToEdit] = useState<TruckLocation | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const url: string = config.API_BASE_URL + '/Home/truckcalendarlocationlist'

        axios.get<TruckLocation[]>(url)
            .then(response => {
                setTruckLocations(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            });

    }, [isCreateEditCalendarModalOpen, submitting]);

    const handleEdit = (location: TruckLocation) => {
        setTruckLocationToEdit(location);
        setIsCreateEditCalendarModalOpen(true);
    };

    const handleDelete = (truckLocation: TruckLocation) => {
        if (truckLocation !== null) {
            const deleteTruckLocation = async () => {
                try {
                    setSubmitting(true);
                    const url = config.API_BASE_URL + '/Admin/removetrucklocation/' + truckLocation.id;
                    await axios.delete(url);
                } catch (error) {
                    setError('Fejl');
                    console.error(error);
                } finally {
                    setSubmitting(false);
                }
            };

            deleteTruckLocation();  // Call the inner async function
        }
    };

    const handleNewLocation = () => {
        setTruckLocationToEdit(null);
        setIsCreateEditCalendarModalOpen(true);
    };

    const handleCloseCreateEditPlaceModal = () => {
        setIsCreateEditCalendarModalOpen(false);
    };

    return (
        <div>
            <AdminCalendarCreateEdit
                isOpen={isCreateEditCalendarModalOpen}
                onClose={handleCloseCreateEditPlaceModal}
                truckLocationToEdit={truckLocationToEdit}
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
                    Kalender
                </div>
                <div style={{
                    textAlign: 'left'
                }}>
                    <p>Herunder er liste med aftaler.
                    </p>


                </div>
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    {truckLocations.map((curLocation, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ccc',    // Border around each row
                                padding: '10px',             // Optional: Adds spacing inside each row
                                marginBottom: '5px',         // Optional: Adds spacing between rows
                                display: 'grid',
                                gridTemplateColumns: '3fr 4fr 3fr 3fr 3fr 3fr', // Adjust column sizes as needed
                                alignItems: 'center'
                            }}
                        >
                            <div>{curLocation.startdatetime}</div>
                            <div>{curLocation.locationname}</div>
                            <div>{curLocation.startdatetime}</div>
                            <div>{curLocation.enddatetime}</div>
                            <div>
                                <img
                                    src="/images/edit-icon.png"
                                    alt="Slet"
                                    onClick={() => handleEdit(curLocation)}
                                    style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                                />
                                {/* <button
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
                                </button> */}
                            </div>
                            <div>
                                <img
                                    src="/images/delete-icon.png"
                                    alt="Slet"
                                    onClick={() => handleDelete(curLocation)}
                                    style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                                />
                                {/* <button
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
                                </button> */}
                            </div>
                        </div>
                    ))}

                    <div
                        style={{
                            border: '1px solid #ccc',    // Border around each row
                            padding: '10px',             // Optional: Adds spacing inside each row
                            marginBottom: '5px',         // Optional: Adds spacing between rows
                            display: 'grid',
                            gridTemplateColumns: '3fr 4fr 3fr 3fr 3fr 3fr', // Adjust column sizes as needed
                            alignItems: 'center'
                        }}
                    >


                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div>
                            <img
                                src="/images/new-icon.png"
                                alt="Slet"
                                 onClick={handleNewLocation}
                                style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                            />
                            {/* <button
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
                        </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AdminCalendar;