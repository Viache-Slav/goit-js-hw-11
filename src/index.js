import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGallery } from './createGallery';

const API_key = '36085372-0e054a65c2dad8200a3139bdc';
const API_URL = 'https://pixabay.com/api/';

const searchInputEl = document.querySelector('#search-form input');
const searchButtonEl = document.querySelector('#search-form button');
const galleryEl = document.querySelector('.gallery');
const loadMoreButtonEl = document.querySelector('.load-more');

let page = 1;

const searchApi = async () => {
  const response = await axios.get(API_URL, {
    params: {
      key: API_key,
      q: searchInputEl.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: '20',
      page: page,
    },
  });
  return response;
};

const getPhotos = () => {
  searchApi()
    .then(pictures => {
      const totalHits = pictures.data.total;
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

      if (pictures.data.hits.length === 0) throw new Error();

      totalHits > 40
        ? (loadMoreButtonEl.style.visibility = 'visible')
        : (loadMoreButtonEl.style.visibility = 'hidden');

      galleryEl.innerHTML = createGallery(pictures);
      let lightbox = new SimpleLightbox('.gallery a');
      page += 1;
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
};

const loadMorePhotos = () => {
  searchApi().then(pictures => {
    const totalHits = pictures.data.total;
    const totalPages = totalHits / 40;

    totalHits > 40
      ? (loadMoreButtonEl.style.visibility = 'visible')
      : (loadMoreButtonEl.style.visibility = 'hidden');

    if (page > totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    galleryEl.insertAdjacentHTML('beforeend', createGallery(pictures));
    let lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
};

searchButtonEl.addEventListener('click', event => {
  event.preventDefault();
  page = 1;
  getPhotos();
});

loadMoreButtonEl.addEventListener('click', event => {
  page += 1;
  loadMorePhotos();
});