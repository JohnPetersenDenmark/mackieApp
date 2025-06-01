import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TruckLocation } from '../../types/TruckLocation';


const AdminPlaces: React.FC = () => {

    const [locations, setLocations] = useState<TruckLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<TruckLocation[]>('http://192.168.8.105:5000/Home/locationlist')
            .then(response => {
                setLocations(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            });

    }, []);

    return (
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
                {locations.map((location, index) => (
                    <div
                        key={index}
                        style={{
                            border: '1px solid #ccc',    // Border around each row
                            padding: '10px',             // Optional: Adds spacing inside each row
                            marginBottom: '5px',         // Optional: Adds spacing between rows
                            display: 'grid',
                            gridTemplateColumns: '1fr 5fr', // Adjust column sizes as needed
                            alignItems: 'center'
                        }}
                    >
                        <div>Stade id.: {location.id}</div>
                        <div>{location.locationname}</div>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminPlaces;