import { UserData } from "../../data/user.js";
import { htmlToFragment } from "../../lib/utils.js";
import { ProfileView } from "../../ui/profile/index.js";
import template from "./template.html?raw";


let M = {};


let C = {};

C.handler_clickOnLogout = async function(event) {
    event.preventDefault();
    // Logique de déconnexion
    console.log("Déconnexion...");
    await UserData.logout();

    M.User = null;

    if (window.router) {
        window.router.setAuth(false);
    }

    // ✅ CORRECTION : Rediriger vers la page de login
    setTimeout(() => {
        if (window.router) {
            window.router.navigate("/login");
        } else {
            window.location.hash = "/login";
        }
    }, 100);

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

    let formDOM = ProfileView.dom();

    const slot = pageFragment.querySelector('slot[name="profile"]');
    if (slot) {
        slot.replaceWith(formDOM);
    }
    
    return pageFragment;
};
V.attachEvents = function(pageFragment) {
    let logoutBtn = pageFragment.querySelector('button[type="button"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', C.handler_clickOnLogout);
    }
    return pageFragment;
};

export function ProfilePage() {
    return C.init();
}
