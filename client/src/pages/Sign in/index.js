import { htmlToFragment } from "../../lib/utils.js";
import { UserFormView } from "../../ui/sign in/index.js";
import template from "./template.html?raw";

let M = {};
let C = {};

// Initialisation
C.init = async function(){
    return V.init();
}

let V = {};
V.init = function(){
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
}

// Création de la page
V.createPageFragment = function(){
    let pageFragment = htmlToFragment(template);

    // injecter le formulaire utilisateur dynamique
    let userFormSlot = pageFragment.querySelector('slot[name="userForm"]');
    if (userFormSlot) userFormSlot.replaceWith(UserFormView.dom());

    return pageFragment;
}

// Attacher les événements
V.attachEvents = function(pageFragment){
    // Les événements du formulaire sont gérés dans le composant UserFormView
    return pageFragment;
}

export function SignInPage(params){
    return C.init(params);
}