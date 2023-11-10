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
let numPage = 1;

async function getResponse(numPage) {
  try {
    const BASE_URL = `https://pixabay.com/api/`;
    const userQuery = input.value;

    const response = await axios.get(BASE_URL, {
      params: {
        key: '40508767-6cd82c1efe9e2d82c03812311',
        q: userQuery,
        page: numPage,
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

let lastRequest = '';

async function handleSubmit(evt) {
  evt.preventDefault();

  let currentRequest = input.value;

  if (currentRequest) {
    page = 1;
  }

  if (currentRequest === lastRequest) {
    Notiflix.Report.info(
      '',
      'The request has already been sent. Please enter a new request'
    );
    searchForm.reset();
    searchBtn.disabled = true;
    return;
  }

  const response = await getResponse(numPage++);
  const resultData = response.data.hits;
  const totalHits = response.data.totalHits;

  if (resultData.length === 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Report.failure(
      '',
      'Sorry, there are no images matching your search query. Please try again.'
    );
    searchForm.reset();
  } else {
    loadMoreBtn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  lastRequest = currentRequest;

  gallery.innerHTML = createMarkup(resultData);

  searchBtn.disabled = true;

  const lightbox = new SimpleLightbox('.js-gallery a', {
    captionDelay: 250,
  });
}

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
  const response = await getResponse(numPage++);

  const resultData = response.data.hits;

  gallery.insertAdjacentHTML('beforeend', createMarkup(resultData));

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  const currentPage = response.config.params.page;
  const totalPages = Math.round(response.data.totalHits / 40);

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

// *********************************************

document.addEventListener('DOMContentLoaded', function () {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', function () {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  scrollToTopBtn.addEventListener('click', function () {
    scrollToTop(1000);
  });

  function scrollToTop(duration) {
    const start = window.pageYOffset;
    const startTime = performance.now();

    function animateScroll(currentTime) {
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, start, -start, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animateScroll);
  }
});
