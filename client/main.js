import { Movies } from "./movies.js";
import { PersistanceManager } from "./persistanceManager.js";
const containerElement = document.getElementById("content-container");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("rating-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const submitRating = document.getElementById("submit-rating");
const modalHeading = document.getElementById("modal-heading");
const deleteRating = document.getElementById("delete-rating");
const ratingElement = document.getElementById("rating");
const commentInput = document.getElementById("comment");

const storageManager = new PersistanceManager();

const movies = new Movies();
let selectedMovie = null;

const adjustScrollArrows = (activeContainer, scrollLeft) => {
  const allScrolls = document.querySelectorAll(".content-row");
  allScrolls.forEach((scrollEl) => {
    const isScrollable =
      scrollEl.scrollWidth > scrollEl.offsetWidth ? true : false;
    const scrollForwardEl = scrollEl.querySelector(".arrow-forward-container");
    const scrollBackEl = scrollEl.querySelector(".arrow-back-container");
    if (isScrollable) {
      scrollForwardEl.style.opacity = 1;
    } else {
      scrollForwardEl.style.opacity = 0;
    }

    // check if was container that was just scrolled
    const curScrollLeft =
      activeContainer?.id === scrollEl.id ? scrollLeft : scrollEl.scrollLeft;

    if (!isScrollable || curScrollLeft < 10) {
      scrollBackEl.style.opacity = 0;
    } else {
      scrollBackEl.style.opacity = 1;
    }
  });
};

(async () => {
  const storedMovieData = storageManager.getPersistedMovies();
  if (storedMovieData.length) {
    console.log("restored movies list");
    movies.restoreList(storedMovieData);
    await movies.fetchRatings();
  } else {
    await movies.fetchMainLists();
    storageManager.persistMovies(movies.getList());
  }
  movies.renderLists(containerElement);
  adjustScrollArrows();
})();

window.openModal = (sectionId, id, isYourRating) => {
  const movie = movies.getItem(sectionId, id);
  if (!movie) return;
  ratingElement.value = movie.your_rating || 1;
  commentInput.value = movie.your_comment || "";
  selectedMovie = movie;
  modalImg.setAttribute("src", movie.poster_url);
  modalTitle.textContent = `Title: ${movie.title}`;
  overlay.style.display = "block";
  modal.style.display = "block";
  if (isYourRating) {
    modalHeading.textContent = "Edit Your Rating";
    submitRating.textContent = "Submit Edit";
    deleteRating.style.display = "block";
  } else {
    modalHeading.textContent = "Add New Rating";
    submitRating.textContent = "Submit Rating";
    deleteRating.style.display = "none";
  }
  setTimeout(() => {
    overlay.classList.add("active");
    modal.classList.add("active");
  }, 10);
};

window.closeModal = () => {
  overlay.classList.remove("active");
  modal.classList.remove("active");
  setTimeout(() => {
    overlay.style.display = "none";
    modal.style.display = "none";
  }, 500);
};

submitRating.addEventListener("click", function () {
  if (!selectedMovie) return;
  const rating = ratingElement.value;
  const comment = commentInput.value;
  if (!rating) return alert("Missing field");
  movies.setRating(selectedMovie, comment, rating);
  movies.renderLists(containerElement);
  storageManager.persistMovies(movies.getList());
  window.closeModal();
  adjustScrollArrows();
});

deleteRating.addEventListener("click", function () {
  if (!selectedMovie) return;
  movies.deleteRating(selectedMovie.id);
  movies.renderLists(containerElement);
  storageManager.persistMovies(movies.getList());
  window.closeModal();
  adjustScrollArrows();
});

window.sectionScroll = (direction, containerId) => {
  if (!direction || !containerId) return;
  const el = document.getElementById(containerId);
  const curScroll = el.scrollLeft || 0;
  const nextScroll =
    direction === "forward" ? curScroll + 500 : curScroll - 500;
  el.scrollLeft = nextScroll;
  adjustScrollArrows(el, nextScroll);
};
