import React from 'react';
import { TruckLocation } from '../types/TruckLocation';

interface TruckLocationListProps {
  locations: TruckLocation[];

}

const TruckLocationList: React.FC<TruckLocationListProps> = ({ locations }) => {

  let interval = "ingen";

  if (locations.length > 0) {
    let lastDayLocation = locations[locations.length - 1];
    let firstDayLocation = locations[0];

    let lastDayString = lastDayLocation.startdatetime;
    let firstDayString = firstDayLocation.startdatetime

    const [dayEnd, monthEnd, yearEnd] = lastDayString.split(" ")[0].split("-");
    const isoLastDate = new Date(`${yearEnd}-${monthEnd}-${dayEnd}`); // "2025-07-15"

    const [dayStart, monthStart, yearStart] = firstDayString.split(" ")[0].split("-");
    const isoStartDate = new Date(`${yearStart}-${monthStart}-${dayStart}`); // "2025-07-15"

    const formattedEndDate = new Intl.DateTimeFormat("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(isoLastDate);

    const formattedStartDate = new Intl.DateTimeFormat("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(isoStartDate);



    let intervalStartDay = formattedStartDate.slice(0, 2)
    let intervalEndDay = formattedEndDate.slice(0, 2)

    intervalStartDay = intervalStartDay.replaceAll('.', '');
    intervalEndDay = intervalEndDay.replaceAll('.', '');

    const [endDay, endMonth, endYear] = formattedEndDate.split(" ")
    const [startDay, startMonth, startYear] = formattedStartDate.split(" ")


    interval = intervalStartDay + ' ' + startMonth + ' - ' + intervalEndDay + ' ' + endMonth;
  }

  function getWeekDayName(dateAsString: string) {

    const [dayEnd, monthEnd, yearEnd] = dateAsString.split(" ")[0].split("-");
    const date = new Date(`${yearEnd}-${monthEnd}-${dayEnd}`); // "2025-07-15"
    let formattedWeekDayName = new Intl.DateTimeFormat("da-DK", {
        day: "numeric",
      month: "long",
      weekday: "long",
    }).format(date);

    formattedWeekDayName = formattedWeekDayName.toUpperCase();
    return formattedWeekDayName;
  }


  return (
    <div style={{ color: '#ffffff', display: 'grid', gridTemplateColumns: '1fr ', textAlign: 'center' }}>
      <br />
      <div style={{ fontSize: '30px' }}>
        {interval}
        <br /><br />
        <hr
          style={{
            height: '1px',
            backgroundColor: '#999',
            border: 'none',
            width: '30%',
            margin: '0 auto'
          }}
        />
      </div>
      {locations.map((loc, index) => (
        <React.Fragment key={index}>

          <div style={{ fontSize: '20px', marginTop: '15px' }}>
            {/* {loc.locationbeautifiedstartdatetime.slice(0, -5)}  */}

            {getWeekDayName(loc.startdatetime)}
          </div>


          <div style={{ color: '#000000', fontSize: '20px' }}>{loc.locationname}</div>
          <div style={{ fontSize: '20px' }}>
            {loc.locationbeautifiedTimeInterval}
            <br /><br />
            <hr
              style={{
                height: '1px',
                backgroundColor: '#999',
                border: 'none',
                width: '20%',
                margin: '0 auto'
              }}
            />
          </div>

        </React.Fragment>
      ))}
    </div>
  );
};

export default TruckLocationList;
