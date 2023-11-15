import axios, { Axios } from 'axios';
import { input } from './search-pictures';
export async function getResponse(numPage, postRerPage) {
  try {
    const BASE_URL = `https://pixabay.com/api/`;
    const userQuery = input.value;

    const response = await axios.get(BASE_URL, {
      params: {
        key: '40508767-6cd82c1efe9e2d82c03812311',
        q: userQuery,
        page: numPage,
        per_page: postRerPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}
