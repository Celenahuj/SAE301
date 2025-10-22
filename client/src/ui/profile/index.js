import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProfileView = {};

// Créer uniquement le DOM du formulaire (pas d'événements)
ProfileView.dom = function(){
    let fragment = htmlToFragment(template);
    return fragment;
}

export { ProfileView };