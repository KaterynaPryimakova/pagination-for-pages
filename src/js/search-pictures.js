import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import { getResponse } from './api';
import { createMarkup } from './markup';
import { scrollToTop } from './scrollToTop';

const searchForm = document.querySelector('.js-search-form');
export const input = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('.js-search-btn');
const gallery = document.querySelector('.js-gallery');
const loadMoreBtn = document.querySelector('.js-load-more');

searchForm.addEventListener('submit', handleSubmit);
input.addEventListener('input', changeBtn);
loadMoreBtn.addEventListener('click', loadMore);

searchBtn.disabled = true;
loadMoreBtn.style.display = 'none';
let numPage = 1;
let lastRequest = '';

async function handleSubmit(evt) {
  evt.preventDefault();

  numPage = 1;

  let currentRequest = input.value;

  if (currentRequest === lastRequest) {
    Notiflix.Report.info(
      '',
      'The request has already been sent. Please enter a new request'
    );
    searchForm.reset();
    searchBtn.disabled = true;
    return;
  }

  const response = await getResponse(numPage);
  const resultData = response.data.hits;
  const totalHits = response.data.totalHits;
  const per_page = response.config.params.per_page;
  console.log(response.config.params.page);

  if (resultData.length === 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Report.failure(
      '',
      'Sorry, there are no images matching your search query. Please try again.'
    );
    searchForm.reset();
  } else if (resultData.length < per_page) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  lastRequest = currentRequest;

  gallery.innerHTML = createMarkup(resultData);

  lightbox.refresh();

  searchBtn.disabled = true;
}

const lightbox = new SimpleLightbox('.js-gallery a', {
  captionDelay: 250,
});

function changeBtn() {
  if (input.value.trim() === '') {
    searchBtn.disabled = true;
    loadMoreBtn.disabled = true;
  } else {
    searchBtn.disabled = false;
    loadMoreBtn.disabled = false;
  }
}

async function loadMore() {
  const response = await getResponse((numPage += 1));

  const resultData = response.data.hits;

  gallery.insertAdjacentHTML('beforeend', createMarkup(resultData));
  lightbox.refresh();
  console.log(response.config.params.page);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  const per_page = response.config.params.per_page;
  const currentPage = response.config.params.page;
  const totalPages = Math.round(response.data.totalHits / per_page);

  if (currentPage === totalPages) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Report.info(
      'Refresh the page',
      "We're sorry, but you've reached the end of search results."
    );
    searchBtn.disabled = true;
    input.disabled = true;
    return;
  }
}
