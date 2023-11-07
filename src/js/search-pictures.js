import axios, { Axios } from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const searchForm = document.querySelector('.js-search-form');
const input = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('.js-search-btn');
const gallery = document.querySelector('.js-gallery');

searchForm.addEventListener('submit', handleSubmit);

async function handleSubmit(evt) {
  evt.preventDefault();
  const BASE_URL = 'https://pixabay.com/api';
  const userQuery = input.value;
  let page = 1;
  const result = await axios
    .get(BASE_URL, {
      params: {
        key: '40508767-6cd82c1efe9e2d82c03812311',
        q: userQuery,
        page: page++,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(function (response) {
      console.log(response.data);

      const resultData = response.data.hits;

      if (resultData.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      gallery.innerHTML = createMarkup(resultData);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
}
