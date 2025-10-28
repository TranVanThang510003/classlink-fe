import axios from "../util/axios.custom";

export const getUserInf = async () => {
  const res = await axios.post("/api/users/me");
  return res.data;
};


