// ****INFINITE SCROLL***

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};
let page = 1;
let search;
let gallery = new SimpleLightbox('.gallery a');

let options = {
  rootMargin: '300px',
};
elements.form.addEventListener('submit', handlerSearch);

let observer = new IntersectionObserver(handlerInfScroll, options);

function handlerSearch(evt) {
  page = 1;
  evt.preventDefault();
  observer.unobserve(elements.guard);
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
      if (page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      createMarkup(response.data.hits);
      if (page * 40 < response.data.totalHits) {
        observer.observe(elements.guard);
      } else {
        observer.unobserve(elements.guard);
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'Something went wrong! Please try reload the page.'
    );
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
      }) => `<a href="${largeImageURL}"><div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" width="300" height="200" loading="lazy" class="card-image" />
      <div class="info">
        <p class="info-item">${likes}
          <br><b>Likes</b>
        </p>
        <p class="info-item">${views}
        <br><b>Views</b>
        </p>
        <p class="info-item">${comments}
        <br><b>Comments</b>
        </p>
        <p class="info-item">${downloads}
        <br><b>Downloads</b>
        </p>
      </div>
    </div></a>`
    )
    .join('');
  elements.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function handlerInfScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      searchPics(search);
    }
  });
}

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});

// ******* LOAD MORE ****

// import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const elements = {
//   form: document.querySelector('.search-form'),
//   gallery: document.querySelector('.gallery'),
//   loadBtn: document.querySelector('.load-more'),
// };
// let page = 1;
// let search;
// let gallery = new SimpleLightbox('.gallery a');

// elements.form.addEventListener('submit', handlerSearch);
// elements.loadBtn.addEventListener('click', handlerLoadMore);

// function handlerLoadMore(evt) {
//   page += 1;
//   searchPics(search);
// }

// function handlerSearch(evt) {
//   page = 1;
//   evt.preventDefault();
//   elements.gallery.innerHTML = '';
//   let searchValue = evt.target.searchQuery.value;
//   searchPics(searchValue);
//   evt.target.reset();
// }

// async function searchPics(query) {
//   try {
//     const API_KEY = '39213885-34944342d2bc042f9d48f9344';
//     const BASE_URL = 'https://pixabay.com/api/';
//     search = query;
//     const params = new URLSearchParams({
//       key: API_KEY,
//       q: query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       per_page: '40',
//       page,
//     });

//     const response = await axios.get(`${BASE_URL}?${params}`);
//     if (response.data.hits.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       if (page === 1) {
//         Notiflix.Notify.success(
//           `Hooray! We found ${response.data.totalHits} images.`
//         );
//       }
//       createMarkup(response.data.hits);
//       if (page * 40 < response.data.totalHits) {
//         elements.loadBtn.classList.remove('hidden');
//       } else {
//         elements.loadBtn.classList.add('hidden');
//         Notiflix.Notify.warning(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// function createMarkup(arr) {
//   const markup = arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `<a href="${largeImageURL}"><div class="photo-card">
//              <img src="${webformatURL}" alt="${tags}" width="300" height="200" loading="lazy" class="card-image" />
//             <div class="info">
//                <p class="info-item">${likes}
//                  <br><b>Likes</b>
//                </p>
//                <p class="info-item">${views}
//                <br><b>Views</b>
//                </p>
//                <p class="info-item">${comments}
//                <br><b>Comments</b>
//                </p>
//                <p class="info-item">${downloads}
//                <br><b>Downloads</b>
//                </p>
//              </div>
//            </div></a>`
//     )
//     .join('');
//   elements.gallery.insertAdjacentHTML('beforeend', markup);
//   gallery.refresh();
// }
