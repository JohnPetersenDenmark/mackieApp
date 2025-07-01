import axios from 'axios';
import config from '../config';

export async function AxiosClientGet(apiUrl: string, sendToken: boolean): Promise<any[]> {
  let token = '';

  const url = config.API_BASE_URL + apiUrl;

  if (sendToken) {
    const tokenData = localStorage.getItem('authToken');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch {
        throw new Error('Invalid token in localStorage');
      }
    }

    try {
      const response = await axios.get<any[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (err: any) {
      // Re-throw with a helpful message if possible
      const message = err?.response?.data?.message || err?.message || 'Unknown API error';
      throw new Error(message);
    }

  }
  else{
      try {
      const response = await axios.get<any[]>(url);

      return response.data;

    } catch (err: any) {
      // Re-throw with a helpful message if possible
      const message = err?.response?.data?.message || err?.message || 'Unknown API error';
      throw new Error(message);
    }
  }
}



export async function AxiosClientPost(apiUrl: string, payload: any, sendToken: boolean): Promise<any[]> {
  let token = '';

  const url = config.API_BASE_URL + apiUrl;

  if (sendToken) {
    const tokenData = localStorage.getItem('authToken');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch {
        throw new Error('Invalid token in localStorage');
      }
    }

    try {
      const response = await axios.post<any[]>(url, payload, {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (err: any) {
      // Re-throw with a helpful message if possible
      const message = err?.response?.data?.message || err?.message || 'Unknown API error';
      throw new Error(message);
    }

  }
  else{
      try {
      const response = await axios.post<any[]>(url, payload);

      return response.data;

    } catch (err: any) {
      // Re-throw with a helpful message if possible
      const message = err?.response?.data?.message || err?.message || 'Unknown API error';
      throw new Error(message);
    }
  }
}

export async function AxiosClientDelete(apiUrl: string,  sendToken: boolean): Promise<any[]> {
  let token = '';

  const url = config.API_BASE_URL + apiUrl;

  if (sendToken) {
    const tokenData = localStorage.getItem('authToken');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch {
        throw new Error('Invalid token in localStorage');
      }
    }

    try {
      const response = await axios.delete<any[]>(url,  {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (err: any) {
      // Re-throw with a helpful message if possible
      const message = err?.response?.data?.message || err?.message || 'Unknown API error';
      throw new Error(message);
    }

  }
  else{
      try {
      const response = await axios.delete<any[]>(url);

      return response.data;

    } catch (err: any) {
      // Re-throw with a helpful message if possible
      const message = err?.response?.data?.message || err?.message || 'Unknown API error';
      throw new Error(message);
    }
  }
}



