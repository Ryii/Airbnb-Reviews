import http from '../http-common'

class ListingDataService {
  getAll(page = 1) {
    return http.get(`listings?page=${page}`);
  }

  get(id) {
    return http.get(`/listing?id=${id}`);
  }

  find(searchName, searchCountry, searchPropertyType, page = 1) {
    // return http.get(`?${by}=${query}&page=${page}`);
    console.log(searchName, searchCountry, searchPropertyType)
    if (searchCountry === "All Countries" && searchPropertyType === "All Property Types") {
      return http.get(`listings?name=${searchName}&page=${page}`);
    } else if (searchCountry === "All Countries") {
      return http.get(`listings?name=${searchName}&property_type=${searchPropertyType}&page=${page}`);
    } else if (searchPropertyType === "All Property Types") {
      return http.get(`listings?name=${searchName}&country=${searchCountry}&page=${page}`);
    } else {
      return http.get(`listings?name=${searchName}&country=${searchCountry}&property_type=${searchPropertyType}&page=${page}`);
    }
  }

  createUserReview(data) {
    return http.post('/review-new', data);
  }

  updateUserReview(data) {
    return http.put('/review-edit', data);
  }

  deleteUserReview(id, userId) {
    return http.delete(`/review-delete?id=${id}`, {data: {user_id: userId}});
  }

  getPropertyTypes() {
    return http.get(`https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-jaygb/service/airbnb/incoming_webhook/property_types`);
  }

  getCountries() {
    return http.get(`https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-jaygb/service/airbnb/incoming_webhook/countries`);
  }
}

export default new ListingDataService();