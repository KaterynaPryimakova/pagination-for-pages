import axios, { Axios } from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const searchForm = document.querySelector('.js-search-form');
const input = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('.js-search-btn');
const gallery = document.querySelector('.js-gallery');
const loadMoreBtn = document.querySelector('.js-load-more');

searchForm.addEventListener('submit', handleSubmit);
input.addEventListener('input', changeBtn);
loadMoreBtn.addEventListener('click', loadMore);

searchBtn.disabled = true;
loadMoreBtn.style.display = 'none';
let page = 1;

async function handleSubmit(evt) {
  try {
    evt.preventDefault();

    if (input.value) {
      page = 1;
    }

    const response = await getResponse();
    const resultData = response.data.hits;
    const totalHits = response.data.totalHits;
    console.log(totalHits);

    if (resultData.length === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      loadMoreBtn.style.display = 'block';
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    gallery.innerHTML = createMarkup(resultData);

    const lightbox = new SimpleLightbox('.js-gallery a', {
      captionDelay: 250,
    });
  } catch (error) {
    console.log(error);
  }

  //   const { height: cardHeight } = document
  //     .querySelector('.gallery')
  //     .firstElementChild.getBoundingClientRect();

  //   window.scrollBy({
  //     top: cardHeight * 2,
  //     behavior: 'smooth',
  //   });
}

function changeBtn() {
  if (input.value.trim() === '') {
    searchBtn.disabled = true;
  } else {
    searchBtn.disabled = false;
  }
}

async function loadMore() {
  try {
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
  } catch (error) {
    console.log(error);
  }
}

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

    return response;
  } catch (error) {
    console.log(error);
  }
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
          <a class="img-link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" /></a>
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
