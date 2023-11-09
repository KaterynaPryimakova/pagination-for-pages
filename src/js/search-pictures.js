import axios, { Axios } from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const searchForm = document.querySelector('.js-search-form');
const input = document.querySelector('input[name="searchQuery"]');
const serchBtn = document.querySelector('.js-search-btn');
const gallery = document.querySelector('.js-gallery');
const loadMoreBtn = document.querySelector('.js-load-more');

let page = 1;
loadMoreBtn.style.display = 'none';

async function getResponse() {
  try {
    const BASE_URL = 'https://pixabay.com/api';
    const userQuery = input.value;

    const response = await axios.get(BASE_URL, {
      params: {
        key: '40508767-6cd82c1efe9e2d82c03812311',
        q: userQuery,
        page: page++,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    //   const response = await responsePromise.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}

searchForm.addEventListener('submit', handleSubmit);

async function handleSubmit(evt) {
  evt.preventDefault();

  const response = await getResponse();
  const resultData = response.data.hits;

  if (resultData.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  gallery.innerHTML = createMarkup(resultData);

  const lightbox = new SimpleLightbox('.js-gallery a', {
    captionDelay: 250,
  });

  loadMoreBtn.style.display = 'block';

  loadMoreBtn.addEventListener('click', loadMore);
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
          <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" /></a>
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

async function loadMore() {
  const response = await getResponse();
  console.log(response);

  const resultData = response.data.hits;

  gallery.insertAdjacentHTML('beforeend', createMarkup(resultData));

  const currentPage = response.config.params.page;
  const totalPages = response.data.total;
  console.log(currentPage);
  console.log(totalPages);

  if (currentPage === totalPages) {
    loadMoreBtn.style.display = 'none';
  }
}
