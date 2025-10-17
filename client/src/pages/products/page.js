import { ProductData } from "../../data/product.js";
import { CategoryData } from "../../data/category.js";
import { CardView } from "../../ui/card/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = { products: [] };
let C = {};

// Gestion du clic sur un produit
C.handler_clickOnProduct = function(ev){
    if(ev.target.dataset.buy !== undefined){
        let id = ev.target.dataset.buy;
        alert(`Le produit d'identifiant ${id} ? Excellent choix !`);
    }
}

// Initialisation
C.init = async function(params){
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
    let pageFragment = htmlToFragment(template);

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
