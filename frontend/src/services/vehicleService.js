import axios from "../axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const vehicleService = {
  getAllVehicles: async (type = null, status = null) => {
    let url = "/vehicles";
    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (status) params.append("status", status);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await axios.get(`/vehicles/${id}`, getAuthHeaders());
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await axios.post(
      "/vehicles",
      vehicleData,
      getAuthHeaders()
    );
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await axios.put(
      `/vehicles/${id}`,
      vehicleData,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await axios.delete(`/vehicles/${id}`, getAuthHeaders());
    return response.data;
  },

  completeMaintenance: async (id) => {
    const response = await axios.post(
      `/vehicles/${id}/complete-maintenance`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },
};

export default vehicleService;
