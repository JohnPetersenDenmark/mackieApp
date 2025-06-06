import React from 'react';
import { TruckLocation } from '../types/TruckLocation';

interface TruckLocationListProps {
  locations: TruckLocation[];

}

const TruckLocationList: React.FC<TruckLocationListProps> = ({ locations }) => {

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
      {locations.map((loc, index) => (
        <React.Fragment key={index}>

          {loc.locationbeautifiedstartdatetime.slice(0, -5)}         
          <div>{loc.locationname}</div>
          <div>{loc.locationbeautifiedTimeInterval}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TruckLocationList;
