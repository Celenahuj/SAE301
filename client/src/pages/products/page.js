import { ProductData } from "../../data/product.js";
import { CategoryData } from "../../data/category.js";
import { CardView } from "../../ui/card/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = { products: [] };
let C = {};

C.handler_clickOnProduct = function(ev){
    if(ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        alert(`Le produit d'identifiant ${id} ? Excellent choix !`);
    }
}

C.init = async function(params){
    if(params?.id){
        // Si un id de catégorie est présent, on filtre
        M.products = await CategoryData.fetchByCategory(params.id);
    } else {
        // Sinon, tous les produits
        M.products = await ProductData.fetchAll(); 
    }
    return V.init(M.products);
}

let V = {};
V.init = function(data){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function(data){
    let pageFragment = htmlToFragment(template);
    let productsDOM = CardView.dom(data);
    pageFragment.querySelector('slot[name="products"]').replaceWith(productsDOM);
    return pageFragment;
}

V.attachEvents = function(pageFragment){
    pageFragment.firstElementChild.addEventListener("click", C.handler_clickOnProduct);
    return pageFragment;
}

export function ProductsPage(params){
    return C.init(params);
}
