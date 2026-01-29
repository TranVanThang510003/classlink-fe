import axios from "../../util/axios.custom";

export const getUserInf = async () => {
  const res = await axios.get("/api/users/me");
  return res.data;
};


