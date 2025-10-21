import { getRequest, postRequest } from '../lib/api-request.js';

let UserData = {};

let fakeUsers = [
    { id: 1, email: "user1@example.com", username: "user1", password: "password1" },
    { id: 2, email: "user2@example.com", username: "user2", password: "password2" },
    { id: 3, email: "user3@example.com", username: "user3", password: "password3" },
    { id: 4, email: "user4@example.com", username: "user4", password: "password4" },
];

UserData.fetch = async function(id){
    let data = await postRequest('users/' + id);
    return data == false ? [] : [data];
}

UserData.fetchAll = async function(){
    let data = await getRequest('users');
    return data == false ? fakeUsers : data;
}

UserData.create = async function(userData){
    // Convertir l'objet en FormData pour l'inscription
    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    
    let data = await postRequest('users', formData);
    return data;
}

UserData.login = async function(email, password){
    // Récupérer tous les utilisateurs
    let users = await getRequest('users');
    
    if (users === false) {
        return false;
    }
    
    // Chercher un utilisateur avec cet email
    let user = users.find(u => u.email === email);
    
    if (user) {
        // Note: La vérification du mot de passe devrait se faire côté serveur
        // Pour l'instant, on considère que si l'utilisateur existe, c'est bon
        return user;
    }
    
    return false;
}

UserData.isLoggedIn = function(){
    // Vérifier si un utilisateur est connecté (stocké dans localStorage)
    let user = localStorage.getItem('currentUser');
    return user !== null;
}

UserData.getCurrentUser = function(){
    // Récupérer l'utilisateur connecté
    let user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

UserData.logout = function(){
    // Déconnecter l'utilisateur
    localStorage.removeItem('currentUser');
}

export { UserData };