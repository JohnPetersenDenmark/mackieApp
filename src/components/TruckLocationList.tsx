import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TruckLocation } from '../types/TruckLocation';

const TruckLocationList: React.FC = () => {
  const [locations, setLocations] = useState<TruckLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<TruckLocation[]>('http://192.168.8.105:5000/Home/locationlist')
      .then(response => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load truck locations.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>henter...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      
      <ul>
        {locations.map(loc => (
          <li key={loc.id} style={{ marginBottom: '1rem' , listStyle: 'none' }}>
            <strong>{loc.locationname} </strong>
             {loc.date}
             {loc.starttime} – {loc.enddatetime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TruckLocationList;