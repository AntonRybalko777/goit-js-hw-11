import axios from 'axios';
import Notiflix from 'notiflix';

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};
let page = 1;
let search;

elements.form.addEventListener('submit', handlerSearch);
elements.loadBtn.addEventListener('click', handlerLoadMore);

function handlerLoadMore(evt) {
  page += 1;
  searchPics(search);
}

function handlerSearch(evt) {
  page = 1;
  evt.preventDefault();
  elements.gallery.innerHTML = '';
  let searchValue = evt.target.searchQuery.value;
  searchPics(searchValue);
  evt.target.reset();
}

async function searchPics(query) {
  try {
    const API_KEY = '39213885-34944342d2bc042f9d48f9344';
    const BASE_URL = 'https://pixabay.com/api/';
    search = query;
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: '40',
      page,
    });

    const response = await axios.get(`${BASE_URL}?${params}`);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createMarkup(response.data.hits);
      elements.loadBtn.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" width="400" loading="lazy" />
      <div class="info">
        <p class="info-item">${likes}
          <b>Likes</b>
        </p>
        <p class="info-item">${views}
          <b>Views</b>
        </p>
        <p class="info-item">${comments}
          <b>Comments</b>
        </p>
        <p class="info-item">${downloads}
          <b>Downloads</b>
        </p>
      </div>
    </div>`
    )
    .join('');
  elements.gallery.insertAdjacentHTML('beforeend', markup);
}
