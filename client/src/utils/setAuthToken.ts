import axios from "axios";

const updateAuthTokenHeader = (token?: string) => {
  if (token) axios.defaults.headers.common["x-auth-token"] = token;
  else delete axios.defaults.headers.common["x-auth-token"];
};

export default updateAuthTokenHeader;
