export class DatabaseComm {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async createRating(data) {
    try {
      await fetch("/create-rating", {
        method: "POST",
        body: JSON.stringify(data),
        headers: this.headers,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateRating(data) {
    try {
      await fetch("/update-rating", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: this.headers,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getRatings() {
    try {
      await fetch("/your-ratings", {
        method: "GET",
        headers: this.headers,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async removeRating(id) {
    try {
      await fetch(`/remove-rating?id=${id}`, {
        method: "DELETE",
        headers: this.headers,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const databaseComm = new DatabaseComm();
export { databaseComm };
