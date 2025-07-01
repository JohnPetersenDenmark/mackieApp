import axios from 'axios';
import config from '../config';

async function AxiosClientWithToken(apiUrl: string, sendToken: boolean): Promise<any[]> {
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

export default AxiosClientWithToken;
