import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from "../../data/user.js";

let UserFormView = {};

// Créer le DOM du formulaire
UserFormView.dom = function () {
    let fragment = htmlToFragment(template);
    UserFormView.attachEvents(fragment);
    return fragment;
};

// Attacher les événements au formulaire
UserFormView.attachEvents = function (fragment) {
    const form = fragment.querySelector('#userForm');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Récupérer les valeurs des champs
            const email = form.querySelector('[name="email"]').value;
            const password = form.querySelector('[name="password"]').value;

            const successMsg = fragment.querySelector('#successMessage');
            const errorMsg = fragment.querySelector('#errorMessage');

            try {
                console.log('📧 Vérification si l\'utilisateur existe déjà...');

                // Vérifier si l'email existe déjà
                const allUsers = await UserData.fetchAll();
                const existingUser = allUsers.find(u => u.email === email);

                if (existingUser) {
                    console.log('✅ Utilisateur trouvé, tentative de connexion...');

                    // L'utilisateur existe, on tente de se connecter
                    const Userlogin = await UserData.login(email, password);

                    if (Userlogin && Userlogin !== false) {
                        console.log('✅ Connexion réussie !', Userlogin);

                        // Stocker l'utilisateur dans le localStorage
                        localStorage.setItem('currentUser', JSON.stringify(Userlogin));

                        // Définir l'état d'authentification (selon la doc)
                        if (window.router) {
                            window.router.setAuth(true);
                        }

                        // Afficher le message de succès
                        if (successMsg) {
                            successMsg.textContent = `Bienvenue ${loggedUser.username} ! Redirection en cours...`;
                            successMsg.classList.remove('hidden');
                        }

                        // Masquer le message d'erreur
                        if (errorMsg) {
                            errorMsg.classList.add('hidden');
                        }

                        // Réinitialiser le formulaire
                        form.reset();

                        // Redirection après connexion
                        setTimeout(() => {
                            if (window.router) {
                                window.router.navigate('/');
                            } else {
                                window.location.hash = '/';
                            }
                        }, 1500);
                    } else {
                        // Mot de passe incorrect
                        console.warn('⚠️ Mot de passe incorrect');
                        throw new Error('Mot de passe incorrect pour cet e-mail');
                    }
                } else {
                    // L'utilisateur n'existe pas : à toi d'ajouter ici l'inscription si besoin
                    console.log('ℹ️ Aucun utilisateur trouvé avec cet e-mail.');
                    throw new Error('Aucun compte trouvé avec cet e-mail');
                }

            } catch (error) {
                console.error('❌ Erreur lors du traitement du formulaire :', error.message);

                // Afficher le message d'erreur
                if (errorMsg) {
                    errorMsg.textContent = error.message;
                    errorMsg.classList.remove('hidden');
                }

                // Masquer le message de succès
                if (successMsg) {
                    successMsg.classList.add('hidden');
                }
            }
        });
    }

    return fragment;
};

export { UserFormView };
