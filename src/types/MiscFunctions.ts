import { Order } from '../types/Order';
import { TruckLocation } from '../types/TruckLocation';

export  const filterOrderByTodaysDate = ((sorders: Order[]) => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth(); // 0-based
    const day = now.getUTCDate();

    // Create start and end times in UTC
    const startTimeToday = new Date(Date.UTC(year, month, day, 0, 10, 0));  // today 00:10:00 UTC
    const endTimeToday = new Date(Date.UTC(year, month, day, 23, 59, 59));  // today 23:59:59 UTC

    let filteredOrdersByDate: Order[] = []

    sorders.forEach(order => {
      // const created = parseDanishDateTime(order.createddatetime); // assumes createdAt is ISO UTC string

      const locationDate = parseDanishDateTime(order.locationstartdatetime); // assumes createdAt is ISO UTC string

      // if (created >= startTime && created <= endTime) {
      if (locationDate >= startTimeToday) {
        filteredOrdersByDate.push(order);
      }
    });
    return filteredOrdersByDate
  });



 export const filterTruckLocationsByTodaysDate = ((slocations: TruckLocation[]) => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth(); // 0-based
    const day = now.getUTCDate();

    // Create start and end times in UTC
    const startTime = new Date(Date.UTC(year, month, day, 0, 10, 0));  // today 00:10:00 UTC
    const endTime = new Date(Date.UTC(year, month, day, 23, 59, 59));  // today 23:59:59 UTC

    let filteredLocationsByDate: TruckLocation[] = []

    slocations.forEach(location => {
      // const created = parseDanishDateTime(order.createddatetime); // assumes createdAt is ISO UTC string

      const locationDate = parseDanishDateTime(location.startdatetime); // assumes createdAt is ISO UTC string

      if (locationDate >= startTime) {
        filteredLocationsByDate.push(location);
      }
    });
    return filteredLocationsByDate
  });

  
  export function parseDanishDateTime(dateTimeStr: string): Date {

    try {
        // Split into date and time
    const [dateStr, timeStr] = dateTimeStr.split(' ');

    // Parse date part
    const [day, month, year] = dateStr.split('-').map(Number);

    // Parse time part
    const [hour, minute] = timeStr.split(':').map(Number);

    // JS Date months are 0-indexed
    return new Date(year, month - 1, day, hour, minute);

    } catch (error) {
     var x = 1;
     return new Date
    }

 
  }