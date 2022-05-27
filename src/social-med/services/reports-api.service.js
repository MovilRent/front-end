import http from "../../core/services/http-common";
export class ReportsApiService {
  getAll() {
    return http.get("/report-bugs");
  }

  getById(id) {
    return http.get(`/report-bugs/${id}`);
  }

  create(data) {
    return http.post("/report-bugs", data);
  }

  update(id, data) {
    return http.put(`/report-bugs/${id}`, data);
  }

  delete(id) {
    return http.delete(`/report-bugs/${id}`);
  }
}