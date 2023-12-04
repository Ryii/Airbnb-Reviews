import http from '../http-common'

class ListingDataService {
  getAll(page = 1) {
    return http.get(`?page=${page}`);
  }

  get(id) {
    return http.get(`/id/${id}`);
  }

  find(query, by = "name", page = 1) {
    return http.get(`?${by}=${query}&page=${page}`);
  }

  createUserReview(data) {
    return http.post('/user-review', data);
  }

  updateUserReview(data) {
    return http.put('/user-review', data);
  }

  deleteUserReview(id, userId) {
    return http.delete(`/user-review?id=${id}`, {data: {user_id: userId}});
  }

  getPropertyTypes() {
    return http.get(`/property_types`);
  }

  getCountries() {
    return http.get(`/countries`);
  }
}

export default new ListingDataService();