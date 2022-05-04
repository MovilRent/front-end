import http from "../../core/services/http-common";

export class RatingApiService {
  getAll() {
    return http.get("/ratings");
  }

  create(data) {
    return http.post("/ratings", data);
  }

  update(id, data) {
    return http.put(`/ratings/${id}`, data);
  }

  delete(id) {
    return http.delete(`/ratings/${id}`);
  }
}
