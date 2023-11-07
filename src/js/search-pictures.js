import axios, { Axios } from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const searchForm = document.querySelector('.js-search-form');
const input = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('.js-search-btn');

searchForm.addEventListener('submit', hendleSubmit);

async function hendleSubmit(evt) {
  evt.preventDefault();
  const BASE_URL = 'https://pixabay.com/api';
  const userRequest = input.value;

  const options = {
    headers: {
      key: '40508767-6cd82c1efe9e2d82c03812311',
    },
  };

  const params = new URLSearchParams({
    q: userRequest,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const result = await axios
    .get(BASE_URL, {
      params: {
        key: '40508767-6cd82c1efe9e2d82c03812311',
        q: userRequest,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}
