import { ProductData } from "../../data/product.js";
import { CategoryData } from "../../data/category.js";
import { CardView } from "../../ui/card/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import { AuthData } from "../../data/auth.js";
import { genericRenderer } from "../../lib/utils.js";
import { CartData } from "../../data/cart.js";
import template from "./template.html?raw";

let M = { 
    products: [],
    user: null
};
let C = {};

// Gestion du clic sur un produit
C.handler_clickOnProduct = async function(ev){
    // Trouver le bouton (peut être ev.target ou son parent si on clique sur l'image)
    let button = ev.target.closest('[data-buy]');
    
    if(button){
        ev.preventDefault(); // Empêcher le lien de se déclencher
        ev.stopPropagation(); // Empêcher la propagation vers le parent <a>
        
        let id = button.dataset.buy;
        
        // Trouver le produit dans M.products
        let product = M.products.find(p => p.id == id);
        if (product) {
            // Ajouter au panier
            await CartData.addItem({
                id: product.id,
                name: product.name,
                description: product.description || '',
                image: product.image ? `/${product.image}` : '/placeholder.png',
                price: parseFloat(product.price) || 0
            });
            
            // Feedback visuel
            alert(`✅ "${product.name}" ajouté au panier !`);
        }
    }
}

// Initialisation
C.init = async function(params){
    // Récupérer l'utilisateur connecté
    try {
        let authResult = await AuthData.Auth();
        if (authResult && authResult.auth === true) {
            M.user = authResult;
        }
    } catch (err) {
        console.log("Utilisateur non connecté");
    }

    // récupérer les produits
    if(params?.id){
        M.products = await CategoryData.fetchByCategory(params.id);
    } else {
        M.products = await ProductData.fetchAll(); 
    }

    // récupérer toutes les catégories depuis la base de donnée

    return V.init(M.products);
}

let V = {};
V.init = function(products){
    let fragment = V.createPageFragment(products);
    V.attachEvents(fragment);
    return fragment;
}

// Création de la page
V.createPageFragment = function(products){
    let nombre = products.length;
    let username = M.user?.username || "";
    let renderedTemplate = genericRenderer(template, { 
        username: username,
        nombre: nombre
    });
    
    let pageFragment = htmlToFragment(renderedTemplate);

    // injecter les produits dynamiques
    let productsSlot = pageFragment.querySelector('slot[name="products"]');
    if (productsSlot) productsSlot.replaceWith(CardView.dom(products));

    return pageFragment;
}

// Attacher les événements
V.attachEvents = function(pageFragment){
    pageFragment.firstElementChild.addEventListener("click", C.handler_clickOnProduct);
    return pageFragment;
}

export function ProductsPage(params){
    return C.init(params);
}
