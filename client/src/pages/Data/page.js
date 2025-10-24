import { htmlToFragment } from "../../lib/utils.js";
import { DataFormView } from "../../ui/data/index.js";
import { UserData } from "../../data/user.js";
import { AuthData } from "../../data/auth.js";
import template from "./template.html?raw";

let M = {
  User: null,
};

let C = {};

// ...existing code...

C.handler_form = async function (event) {
  event.preventDefault();

  let form = event.target;

  // ✅ CORRECTION : Utiliser FormData pour récupérer les valeurs
  let formData = new FormData(form);
  let email = formData.get("email");
  let username = formData.get("username");
  let password = formData.get("password");

  console.log("👤 M.User:", M.User);
  console.log("🆔 ID utilisateur:", M.User?.id);
  console.log("📤 Données récupérées:", { email, username, password });

  const successMsg = document.querySelector("#successMessage");
  const errorMsg = document.querySelector("#errorMessage");

  try {
    console.log("💾 Tentative de mise à jour du profil...");

    // Préparer les données à mettre à jour
    let updateData = {
      email: email,
      username: username,
    };

    // N'ajouter le mot de passe que s'il est rempli
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    console.log("📦 Données envoyées au serveur:", updateData);

    // ✅ CORRECTION : Utiliser M.User.id qui existe maintenant
    let result = await UserData.update(M.User.id, updateData);

    console.log("📦 Réponse du serveur:", result);

    if (result && result.id) {
      // Succès : profil mis à jour
      console.log("✅ Profil mis à jour avec succès");

      // ✅ Mettre à jour M.User avec les nouvelles données
      M.User = { ...M.User, ...updateData };

      if (successMsg) {
        successMsg.textContent =
          "Vos informations ont été mises à jour avec succès.";
        successMsg.classList.remove("hidden");
      }
      if (errorMsg) {
        errorMsg.classList.add("hidden");
      }

      // Réinitialiser le champ mot de passe
      let passwordInput = form.querySelector('[name="password"]');
      if (passwordInput) {
        passwordInput.value = "";
      }

      // Masquer le message après 5 secondes
      setTimeout(() => {
        if (successMsg) {
          successMsg.classList.add("hidden");
        }
      }, 5000);
    } else {
      // Échec de la mise à jour
      console.log("❌ Échec de la mise à jour");

      if (errorMsg) {
        errorMsg.textContent =
          result?.error ||
          "Une erreur est survenue lors de la mise à jour. Veuillez réessayer.";
        errorMsg.classList.remove("hidden");
      }
      if (successMsg) {
        successMsg.classList.add("hidden");
      }
    }
  } catch (err) {
    console.error("💥 Erreur lors de la mise à jour :", err);

    if (errorMsg) {
      errorMsg.textContent =
        "Une erreur technique est survenue. Veuillez réessayer ultérieurement.";
      errorMsg.classList.remove("hidden");
    }
    if (successMsg) {
      successMsg.classList.add("hidden");
    }
  }
};

C.handler_clickOnBack = function (event) {
  event.preventDefault();
  if (window.router) {
    window.router.navigate("/"); // Retour à l'accueil ou autre page
  } else {
    window.history.back(); // Fallback
  }
};
C.loadUserData = async function () {
  try {
    console.log("📥 Chargement des données utilisateur...");

    let authResult = await AuthData.Auth();

    // 🔍 DEBUG : Voir exactement ce qui est retourné
    console.log("🔍 authResult brut:", authResult);
    console.log("🔍 authResult.auth:", authResult?.auth);
    console.log("🔍 Type de authResult.auth:", typeof authResult?.auth);

    if (authResult && authResult.auth === true) {
      M.User = authResult;
      console.log("✅ Données utilisateur chargées:", M.User);
      return M.User;
    } else {
      console.log("❌ Utilisateur non authentifié");
      console.log(
        "❌ Raison:",
        !authResult ? "authResult null" : `authResult.auth = ${authResult.auth}`
      );

      // Rediriger vers login si pas authentifié
      if (window.router) {
        window.router.navigate("/login");
      }
      return null;
    }
  } catch (err) {
    console.error("💥 Erreur lors du chargement des données:", err);
    return null;
  }
};
// ✅ CORRECTION : init devient asynchrone et charge les données
C.init = async function () {
  await C.loadUserData(); // ✅ Attendre le chargement des données
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

  // ✅ CORRECTION : Passer les données au template
  let formDOM = DataFormView.dom({
    email: M.User?.email || "",
    username: M.User?.username || "",
  });

  const slot = pageFragment.querySelector('slot[name="updateForm"]');
  if (slot) {
    slot.replaceWith(formDOM);
  }

  return pageFragment;
};

V.attachEvents = function (pageFragment) {
  // ✅ Attacher l'événement au formulaire (qui existe)
  let form = pageFragment.querySelector("form");
  if (form) {
    form.addEventListener("submit", C.handler_form);
  }

  // ✅ Attacher l'événement au bouton retour (qui existe dans le template)
  const backBtn = pageFragment.querySelector("#btnRetour");
  if (backBtn) {
    backBtn.addEventListener("click", C.handler_clickOnBack);
  }

  return pageFragment;
};

// 🧩 Export principal
export function DataPage() {
  return C.init();
}
