import { databaseComm } from "./dbComm.js";
export class Movies {
  constructor() {
    this.mainCategories = [
      {
        id: "your-ratings",
        title: "Your Ratings",
        endpoint: "/your-ratings",
      },
      { id: "popular", title: "Popular", endpoint: "/popular-movies" },
      {
        id: "now-playing",
        title: "Now Playing",
        endpoint: "/now-playing-movies",
      },
      {
        id: "top-rated",
        title: "Top Rated",
        endpoint: "/top-rated-movies",
      },
      {
        id: "upcoming",
        title: "Upcoming",
        endpoint: "/upcoming-movies",
      },
    ];
    this.lists = this.mainCategories.map(() => ({}));
  }

  async fetchRatings() {
    await this.fetchList("your-ratings", "Your Ratings", "/your-ratings", 0);
  }

  setRating(movieInfo, comment, rating) {
    let curList = this.lists.find((list) => list.id === "your-ratings");

    if (!curList) {
      this.lists.unshift({
        name: "Your Ratings",
        id: "your-ratings",
        data: [],
        pages: 1,
      });
      curList = this.lists[0];
    }

    const existingIndex = curList.data.findIndex(
      (movie) => movie.id === movieInfo.id
    );

    if (existingIndex >= 0) {
      curList.data.splice(existingIndex, 1);
    }

    const { poster_url, title, id } = movieInfo;

    const data = {
      poster_url,
      title,
      id,
      your_comment: comment,
      your_rating: rating,
    };

    curList.data.unshift(data);
    databaseComm.createRating(data);
  }

  deleteRating(movieId) {
    const curList = this.lists.find((list) => list.id === "your-ratings");
    if (!curList) return;

    const existingIndex = curList.data.findIndex(
      (movie) => movie.id === movieId
    );

    if (existingIndex >= 0) {
      curList.data.splice(existingIndex, 1);
    }
    databaseComm.removeRating(movieId);
  }

  getItem(sectionId, id) {
    return this.lists
      .find((section) => section.id === sectionId)
      ?.data?.find((movie) => movie.id == id);
  }

  getList() {
    return this.lists;
  }

  restoreList(newList) {
    this.lists = newList;
  }

  async fetchList(id, title, endpoint, index) {
    const curListState = this.lists.find((l) => l.id === id) || {};
    const nextPage = curListState.pages ? curListState.pages + 1 : 1;
    const res = await fetch(`${endpoint}?page=${nextPage}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    const formatted = {
      name: title,
      id: id,
      data,
      pages: nextPage,
    };
    if (isNaN(index)) {
      this.lists.push(formatted);
    } else {
      this.lists[index] = formatted;
    }
  }

  async fetchMainLists() {
    await Promise.all(
      this.mainCategories.map(({ id, title, endpoint }, index) =>
        this.fetchList(id, title, endpoint, index)
      )
    );
  }

  renderLists(containerElement) {
    containerElement.innerHTML = "";
    this.lists.forEach(({ name, data, pages, id: sectionId }) => {
      if (data?.length === 0) return;
      containerElement.innerHTML += ` <h3 id="${sectionId}-title">${name}</h3>`;
      const items = data.map(
        ({
          poster_url,
          release_date,
          title,
          vote_average,
          vote_count,
          id,
          your_rating,
        }) => {
          const isYourRating = sectionId === "your-ratings";
          return `  
            <div class="item">
                <img src="${poster_url}" onclick="window.openModal('${sectionId}', ${id}, ${isYourRating})" />
                <div class="info-container">
                    <span class="title">${title}</span>
                    <div class="rating-container">
                        <div class="star-container">
                            <span class="material-symbols-outlined" style="font-size: 20px;">
                                star
                            </span>
                            <span style="margin-left: 5px; margin-top: 3px;">
                                ${
                                  isYourRating
                                    ? your_rating
                                    : Number(vote_average).toPrecision(2)
                                }
                            </span>
                        </div>
                        <span style="margin-top: 5px;">${
                          isYourRating ? "By you" : vote_count + " votes"
                        }</span>
                    </div>
                </div>
            </div>`;
        }
      );
      const withNav = `
      <section class="content-row" id="${sectionId}">
      <div class="arrow-back-container" id="arrow-back-${sectionId}">
          <span class="material-symbols-outlined scroll-back md-48" onclick='window.sectionScroll("back", "${sectionId}")'>
              arrow_back_ios
          </span>
      </div>
      ${items.join(" ")}
      <div class="arrow-forward-container" id="arrow-forward-${sectionId}">
        <span class="material-symbols-outlined scroll-forward md-48" onclick='window.sectionScroll("forward", "${sectionId}")'>
            arrow_forward_ios
        </span>
        </div>
      </section>
      `;
      containerElement.innerHTML += withNav;
    });
  }
}
