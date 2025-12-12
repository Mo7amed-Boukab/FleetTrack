import axios from "../axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const tripService = {
  getAllTrips: async (search = null, status = null) => {
    let url = "/trips";
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  },

  getTripById: async (id) => {
    const response = await axios.get(`/trips/${id}`, getAuthHeaders());
    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await axios.post("/trips", tripData, getAuthHeaders());
    return response.data;
  },

  updateTrip: async (id, tripData) => {
    const response = await axios.put(
      `/trips/${id}`,
      tripData,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteTrip: async (id) => {
    const response = await axios.delete(`/trips/${id}`, getAuthHeaders());
    return response.data;
  },
};

export default tripService;
