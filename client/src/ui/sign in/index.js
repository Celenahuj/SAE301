import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from "../../data/user.js";

let UserFormView = {};

// Créer le DOM du formulaire
UserFormView.dom = function(){
    let fragment = htmlToFragment(template);
    UserFormView.attachEvents(fragment);
    return fragment;
}

// Attacher les événements au formulaire
UserFormView.attachEvents = function(fragment){
    const form = fragment.querySelector('#userForm');
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            // On récupère les valeurs des champs
            const email = form.querySelector('[name="email"]').value;
            const username = form.querySelector('[name="username"]').value;
            const password = form.querySelector('[name="password"]').value;

            const successMsg = fragment.querySelector('#successMessage');
            const errorMsg = fragment.querySelector('#errorMessage');

            try {
                console.log('📤 Envoi des données au serveur...');
                
                // Utilisation de UserData.create() au lieu de fetch()
                const newUser = await UserData.create({
                    email: email,
                    username: username,
                    password: password
                });
                
                console.log('✅ Réponse reçue du serveur:', newUser);
                
                // Vérifier si la création a réussi
                if (newUser && newUser !== false) {
                    console.log('✅ Utilisateur créé avec succès!');
                    
                    // Succès
                    if (successMsg) {
                        successMsg.textContent = 'Utilisateur enregistré avec succès !';
                        successMsg.classList.remove('hidden');
                    }
                    if (errorMsg) {
                        errorMsg.classList.add('hidden');
                    }
                    
                    // Réinitialiser le formulaire
                    form.reset();
                } else {
                    console.warn('⚠️ Le serveur a retourné false ou null');
                    throw new Error('Le serveur n\'a pas pu créer l\'utilisateur');
                }
                
            } catch (error) {
                console.error('❌ Erreur:', error);
                
                // Erreur
                if (errorMsg) {
                    errorMsg.textContent = 'Une erreur est survenue : ' + error.message;
                    errorMsg.classList.remove('hidden');
                }
                if (successMsg) {
                    successMsg.classList.add('hidden');
                }
            }
        });
    }
    
    return fragment;
}

export { UserFormView };