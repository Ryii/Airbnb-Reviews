import http from '../http-common'

class ListingDataService {
  getAll(page = 1) {
    return http.get(`?page=${page}`);
  }

  get(id) {
    return http.get(`/id/${id}`);
  }

  find(query, by = "name", searchName, searchCountry, searchPropertyType, page = 1) {
    // return http.get(`?${by}=${query}&page=${page}`);
    console.log(searchName, searchCountry, searchPropertyType)
    if (searchCountry == "All Countries" && searchPropertyType == "All Property Types") {
      console.log('1');
      return http.get(`?name=${searchName}&page=${page}`);
    } else if (searchCountry == "All Countries") {
      console.log('2');
      return http.get(`?name=${searchName}&property_type=${searchPropertyType}&page=${page}`);
    } else if (searchPropertyType == "All Property Types") {
      console.log('3');
      return http.get(`?name=${searchName}&country=${searchCountry}&page=${page}`);
    } else {
      console.log('4');
      return http.get(`?name=${searchName}&country=${searchCountry}&property_type=${searchPropertyType}&page=${page}`);
    }
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