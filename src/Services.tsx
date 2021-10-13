import axios from "axios";

const token = "SmDrG2HySFIqrYsytw8PSr5qFzUFUSZMmqjVUknYrNQww8rhqdnmsWKyAXAB";

const service = axios.create({
  baseURL: "/apiv2/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  },
});
/* JSON SERVER -- json-server --watch il-ilce.json */
export function cityList() {
  return axios.get("http://localhost:3000/data");
}

export function getPharmacy(city?: string, county?: string) {
  const params = {
    city: city,
    county: county,
  };
  return service.get("pharmacy", { params: params });
}
