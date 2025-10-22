import { htmlToFragment } from "../../lib/utils.js";
import { UserFormView } from "../../ui/signup/index.js";
import { UserData } from "../../data/user.js";
import template from "./template.html?raw";


let M = {
    User: null
};


let C = {};


C.handler_form = async function(event) {
    event.preventDefault();
    
    let form = event.target;
    let formData = new FormData(form);

    let email = formData.get('email');
    let username = formData.get('username');
    let password = formData.get('password');

    const successMsg = document.querySelector('#successMessage');
    const errorMsg = document.querySelector('#errorMessage');

    let newUser = {
        email: email,
        username: username,
        password: password
    };

    // Attendre la réponse du serveur
    let createdUser = await UserData.create(newUser);
    
    if (createdUser && createdUser !== false) {
        // Succès : utilisateur créé
        M.User = createdUser;
        
        if (successMsg) {
            successMsg.textContent = `Bienvenue ${username} ! Compte créé avec succès.`;
            successMsg.classList.remove('hidden');
        }
        if (errorMsg) {
            errorMsg.classList.add('hidden');
        }
        
        form.reset();
        
        // Redirection vers login
        setTimeout(() => {
            if (window.router) {
                window.router.navigate('/login');
            } else {
                window.location.hash = '/login';
            }
        }, 2000);
    } else {
        // Échec : l'email existe déjà (ou autre erreur)
        if (errorMsg) {
            errorMsg.textContent = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
            errorMsg.classList.remove('hidden');
        }
        if (successMsg) {
            successMsg.classList.add('hidden');
        }
    }
};

C.init = function() {
    return V.init();
};

let V = {};


V.init = function() {
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
};


V.createPageFragment = function() {
    let pageFragment = htmlToFragment(template);
    
    let formDOM = UserFormView.dom();
    
    const slot = pageFragment.querySelector('slot[name="userForm"]');
    if (slot) {
        slot.replaceWith(formDOM);
    }
    
    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    let root = pageFragment.querySelector('form'); 
    root.addEventListener('submit', C.handler_form);
    
    return pageFragment;
};

export function SignupPage() {
    return C.init();
}
