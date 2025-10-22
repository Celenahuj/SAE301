import { htmlToFragment } from "../../lib/utils.js";
import { UserFormView } from "../../ui/login/index.js";
import { UserData } from "../../data/user.js";
import template from "./template.html?raw";

let M = {
    User: null
};

let C = {};

// 🧩 Contrôleur — Gestion du formulaire de login
C.handler_form = async function (event) {
  event.preventDefault();

  let form = event.target;
  let formData = new FormData(form);

  let email = formData.get("email");
  let password = formData.get("password");

  const successMsg = document.querySelector("#successMessage");
  const errorMsg = document.querySelector("#errorMessage");

  try {
    console.log("🔐 Tentative de connexion..."); // ← Debug
    let user = await UserData.login(email, password);
    console.log("📦 Réponse reçue:", user); // ← Debug

    // ✅ Vérifier que c'est un objet utilisateur valide
    if (user && user.id) {
      console.log("✅ Utilisateur authentifié:", user.email); // ← Debug
      
      // Stocker l'utilisateur
      M.User = user;

      // Afficher le message de succès AVANT la redirection
      if (successMsg) {
        successMsg.textContent = `Connexion réussie ! Bienvenue ${user.email}`;
        successMsg.classList.remove("hidden");
      }
      if (errorMsg) {
        errorMsg.classList.add("hidden");
      }

      // Mettre à jour l'authentification et rediriger
      setTimeout(() => {
        console.log("🚀 Mise à jour auth et redirection..."); // ← Debug
        if (window.router) {
          window.router.setAuth(true);
          window.router.navigate("/profile");
          console.log("✅ Navigate appelé"); // ← Debug
        } else {
          console.error("❌ window.router n'existe pas !"); // ← Debug
        }
      }, 500); // ← Augmenter à 500ms pour être sûr

    } else {
      console.log("❌ Échec authentification"); // ← Debug
      if (errorMsg) {
        errorMsg.textContent = user?.error || "Email ou mot de passe incorrect.";
        errorMsg.classList.remove("hidden");
      }
      if (successMsg) {
        successMsg.classList.add("hidden");
      }
    }
  } catch (err) {
    console.error("💥 Erreur lors de la connexion :", err);
    if (errorMsg) {
      errorMsg.textContent = "Une erreur est survenue. Veuillez réessayer.";
      errorMsg.classList.remove("hidden");
    }
  }
};

C.init = function () {
    return V.init();
};

// 🧩 Vue
let V = {};

V.init = function () {
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function () {
    let pageFragment = htmlToFragment(template);

    let formDOM = UserFormView.dom();

    const slot = pageFragment.querySelector('slot[name="userForm"]');
    if (slot) {
        slot.replaceWith(formDOM);
    }

    return pageFragment;
};

V.attachEvents = function (pageFragment) {
    let form = pageFragment.querySelector("form");
    if (form) {
        form.addEventListener("submit", C.handler_form);
    }
    return pageFragment;
};

// 🧩 Export principal
export function LoginPage() {
    return C.init();
}
