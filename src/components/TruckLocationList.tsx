import React from 'react';
import { TruckLocation } from '../types/TruckLocation';

interface TruckLocationListProps {
  locations: TruckLocation[];

}

const TruckLocationList: React.FC<TruckLocationListProps> = ({ locations}) => {
 
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
      {locations.map((loc, index) => (
        <React.Fragment key={index}>
          <div>{loc.startdatetime.split(" ").slice(0, 2).join(" ")}</div>
          <div>{loc.locationname}</div>
          <div>{loc.startdatetime.slice(-5)} – {loc.enddatetime.slice(-5)}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TruckLocationList;
