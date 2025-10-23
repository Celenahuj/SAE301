import { getRequest, jsonpostRequest } from "../lib/api-request.js";

let AuthData = {};

AuthData.login = async function (email, password) {
  const data = await jsonpostRequest("auth/login", { email, password });
  return data;
};


AuthData.Auth = async function () {
  const data = await getRequest("auth");
  return data;
};


AuthData.logout = async function () {
  const data = await jsonpostRequest("auth/logout", {});
  return data;
};

export { AuthData };