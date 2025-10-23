import { getRequest, jsonpostRequest } from "../lib/api-request.js";

let UserData = {};

let fakeUsers = [
  {
    id: 1,
    email: "user1@example.com",
    username: "user1",
    password: "password1",
  },
  {
    id: 2,
    email: "user2@example.com",
    username: "user2",
    password: "password2",
  },
  {
    id: 3,
    email: "user3@example.com",
    username: "user3",
    password: "password3",
  },
  {
    id: 4,
    email: "user4@example.com",
    username: "user4",
    password: "password4",
  },
];

UserData.fetch = async function (id) {
  let data = await getRequest("users/" + id);
  return data == false ? [] : [data];
};

UserData.fetchAll = async function () {
  let data = await getRequest("users");
  return data == false ? fakeUsers : data;
};

UserData.create = async function (userData) {
  const data = await jsonpostRequest("users", userData);
  return data;
};

// ✅ "Pour s'authentifier, on enverra en post les données à api/auth/login"
UserData.login = async function (email, password) {
  const data = await jsonpostRequest("auth/login", { email, password });
  return data;
};

// ✅ Pour vérifier l'authentification
UserData.Auth = async function () {
  const data = await getRequest("auth");
  return data;
};

// ✅ Pour la déconnexion (bonus)
UserData.logout = async function () {
  const data = await jsonpostRequest("auth/logout", {});
  return data;
};

export { UserData };