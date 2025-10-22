import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let UserFormView = {};

// Créer uniquement le DOM du formulaire (pas d'événements)
UserFormView.dom = function(){
    let fragment = htmlToFragment(template);
    return fragment;
}

export { UserFormView };