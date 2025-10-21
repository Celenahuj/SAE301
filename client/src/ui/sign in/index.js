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
                console.log('📧 Vérification si l\'utilisateur existe déjà...');
                
                // Vérifier si l'email existe déjà
                const allUsers = await UserData.fetchAll();
                const existingUser = allUsers.find(u => u.email === email);
                
                if (existingUser) {
                    console.log('✅ Utilisateur trouvé, tentative de connexion...');
                    
                    // L'utilisateur existe, on tente de se connecter
                    const loggedUser = await UserData.login(email, password);
                    
                    if (loggedUser && loggedUser !== false) {
                        console.log('✅ Connexion réussie!', loggedUser);
                        
                        // Stocker l'utilisateur dans localStorage
                        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
                        
                        // ✅ DÉFINIR L'ÉTAT D'AUTHENTIFICATION (selon la doc)
                        if (window.router) {
                            window.router.setAuth(true);
                        }
                        
                        // Succès
                        if (successMsg) {
                            successMsg.textContent = `Bienvenue ${loggedUser.username} ! Redirection...`;
                            successMsg.classList.remove('hidden');
                        }
                        if (errorMsg) {
                            errorMsg.classList.add('hidden');
                        }
                        
                        // Réinitialiser le formulaire
                        form.reset();
                        
                        // ✅ Utiliser router.navigate() au lieu de window.location.hash
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
                        throw new Error('Mot de passe incorrect pour cet email');
                    }
                    return;
                }
                
                console.log('📤 Création du nouvel utilisateur...');
                
                // L'utilisateur n'existe pas, on crée le compte
                const newUser = await UserData.create({
                    email: email,
                    username: username,
                    password: password
                });
                
                console.log('✅ Réponse reçue du serveur:', newUser);
                
                // Vérifier si la création a réussi
                if (newUser && newUser !== false) {
                    console.log('✅ Utilisateur créé avec succès!');
                    
                    // Connecter automatiquement l'utilisateur après inscription
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    
                    // ✅ DÉFINIR L'ÉTAT D'AUTHENTIFICATION (selon la doc)
                    if (window.router) {
                        window.router.setAuth(true);
                    }
                    
                    // Succès
                    if (successMsg) {
                        successMsg.textContent = 'Compte créé avec succès ! Redirection...';
                        successMsg.classList.remove('hidden');
                    }
                    if (errorMsg) {
                        errorMsg.classList.add('hidden');
                    }
                    
                    // Réinitialiser le formulaire
                    form.reset();
                    
                    // ✅ Utiliser router.navigate() au lieu de window.location.hash
                    setTimeout(() => {
                        if (window.router) {
                            window.router.navigate('/');
                        } else {
                            window.location.hash = '/';
                        }
                    }, 2000);
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