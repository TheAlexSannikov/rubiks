import http from "../http-common";

class SequenceDataService {
  getAll() {
    console.log("inside SequenceDataService.getAll()");
    return http.get("/getAll");
  }

  get(id) {
    console.log(`inside SequenceDataService.get(${id})`);
    return http.get(`/sequences?id=${id}`);
  }

  find(query, by = "name", page = 0) {
    console.log(`inside SequenceDataService.find(${query}, ${by}, ${page})`);
    return http.get(`find?${by}=${query}&page=${page}`);
  } 

  saveNewSequence(data) {
    console.log(`inside SequenceDataService.saveNewSequence(${data})`);
    return http.post("", data);
  }

  updateSequence(data) {
    console.log(`inside SequenceDataService.updateSequence(${data})`);
    return http.put("/sequence-edit", data);
  }

  deleteSequence(id, userId) {
    console.log(`inside SequenceDataService.deleteSequence(${id}, ${userId})`);
    return http.delete(`/review-delete?id=${id}`, {data:{user_id: userId}});
  }
}

export default new SequenceDataService();