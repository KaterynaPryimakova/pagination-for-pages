import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import { getResponse } from './api';
import { createMarkup, createMarkupPagination } from './markup';
import { scrollToTop } from './scrollToTop';

const searchForm = document.querySelector('.js-search-form');
export const input = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('.js-search-btn');
const gallery = document.querySelector('.js-gallery');

const papination = document.querySelector('.js-pagination');
const listPagination = document.querySelector('.pagination-list');
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');

searchForm.addEventListener('submit', handleSubmit);
input.addEventListener('input', changeBtn);
papination.addEventListener('click', changePage);

searchBtn.disabled = true;
let numPage = 1;
const postsPerPage = 40;
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

  const response = await getResponse(numPage, postsPerPage);
  const resultData = response.data.hits;
  const totalHits = response.data.totalHits;
  const per_page = response.config.params.per_page;
  const totalPages = Math.round(response.data.totalHits / per_page);
  console.log(response.config.params.page);

  if (resultData.length === 0) {
    Notiflix.Report.failure(
      '',
      'Sorry, there are no images matching your search query. Please try again.'
    );

    searchForm.reset();
  } else if (resultData.length < per_page) {
  } else {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    prevBtn.hidden = false;
    nextBtn.hidden = false;
  }

  lastRequest = currentRequest;

  gallery.innerHTML = createMarkup(resultData);

  listPagination.innerHTML = createMarkupPagination(totalPages);
  // додати активну сторінку
  const itemPage = document.querySelector('.item-page');
  itemPage.getElementsBy;

  lightbox.refresh();

  searchBtn.disabled = true;
}

const lightbox = new SimpleLightbox('.js-gallery a', {
  captionDelay: 250,
});

function changeBtn() {
  if (input.value.trim() === '') {
    searchBtn.disabled = true;
  } else {
    searchBtn.disabled = false;
  }
}

async function changePage({ target }) {
  if (!target.classList.contains('item-page')) {
    return;
  }

  numPage = Number(target.textContent);
  const response = await getResponse(numPage, postsPerPage);
  const resultData = response.data.hits;
  gallery.innerHTML = createMarkup(resultData);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  lightbox.refresh();
  console.log(response.config.params.page);

  const per_page = response.config.params.per_page;
  const currentPage = response.config.params.page;
  const totalPages = Math.round(response.data.totalHits / per_page);

  if (currentPage === totalPages) {
    Notiflix.Report.info(
      'Refresh the page',
      "We're sorry, but you've reached the end of search results."
    );
    searchBtn.disabled = true;
    input.disabled = true;
    return;
  }
}
