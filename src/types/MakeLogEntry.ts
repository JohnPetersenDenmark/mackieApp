import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';
import { LogEntry } from './LogEntry';


export async function MakeLogEntry(entryData: LogEntry) {

await AxiosClientPost("/Home/makeclientlogentry" , entryData, false)

return;
}