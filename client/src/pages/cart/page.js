import { CartData } from "../../data/cart.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import emptyTemplate from "../../ui/cart/empty.template.html?raw";
import cartTemplate from "../../ui/cart/cart.template.html?raw";
import itemTemplate from "../../ui/cart/item.template.html?raw";

let M = {
    cart: []
};

let C = {};

/**
 * Gère le changement de quantité d'un article
 */
C.handleQuantityChange = async function(e) {
    const input = e.target;
    if (!input.dataset.qty) return;
    
    const productId = parseInt(input.dataset.qty);
    const newQuantity = parseInt(input.value);
    
    if (newQuantity > 0) {
        await CartData.updateQuantity(productId, newQuantity);
        await V.refreshCartContent();
    }
};

/**
 * Gère l'augmentation de quantité (+)
 */
C.handleIncrease = async function(e) {
    const btn = e.target.closest('button[data-increase]');
    if (!btn) return;
    
    const productId = parseInt(btn.dataset.increase);
    const item = M.cart.find(i => i.id === productId);
    
    if (item) {
        await CartData.updateQuantity(productId, item.quantity + 1);
        await V.refreshCartContent();
    }
};

/**
 * Gère la diminution de quantité (−)
 */
C.handleDecrease = async function(e) {
    const btn = e.target.closest('button[data-decrease]');
    if (!btn) return;
    
    const productId = parseInt(btn.dataset.decrease);
    const item = M.cart.find(i => i.id === productId);
    
    if (item && item.quantity > 1) {
        await CartData.updateQuantity(productId, item.quantity - 1);
        await V.refreshCartContent();
    }
};

/**
 * Gère la suppression d'un article
 */
C.handleRemoveItem = async function(e) {
    console.log('handleRemoveItem appelé', e.target);
    const btn = e.target.closest('button[data-remove]');
    console.log('Bouton trouvé:', btn);
    if (!btn) return;
    
    const productId = parseInt(btn.dataset.remove);
    console.log('ID produit à supprimer:', productId);
    
    if (confirm('Voulez-vous retirer cet article du panier ?')) {
        await CartData.removeProduct(productId);
        await V.refreshCartContent();
    }
};

/**
 * Gère la fermeture du panier
 */
C.handleClose = function(e) {
    e.preventDefault();
    if (window.router) {
        window.router.navigate("/products");
    }
};

/**
 * Gère le paiement
 */
C.handlePayment = async function(e) {
    e.preventDefault();
    
    if (M.cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    const total = await CartData.getTotalPrice();
    alert(`Paiement de ${total.toFixed(2)}€ en cours...`);
};

/**
 * Initialise la page panier
 */
C.init = async function() {
    M.cart = await CartData.getCart();
    return await V.init();
};

let V = {};

/**
 * Initialise la vue
 */
V.init = async function() {
    const pageFragment = htmlToFragment(template);
    
    // Injecter le contenu du panier
    const slot = pageFragment.querySelector('slot[name="cart-items"]');
    
    if (!slot) return pageFragment;
    
    if (M.cart.length === 0) {
        // Panier vide
        slot.replaceWith(htmlToFragment(emptyTemplate));
    } else {
        // Panier avec articles
        const cartContent = await V.createCartContent();
        slot.replaceWith(cartContent);
    }
    
    // Attacher les événements APRÈS avoir injecté le contenu
    V.attachEvents(pageFragment);
    
    return pageFragment;
};

/**
 * Crée le contenu du panier (liste + récap)
 */
V.createCartContent = async function() {
    const totalPrice = (await CartData.getTotalPrice()).toFixed(2);
    
    let html = cartTemplate;
    html = html.replaceAll('{{priceTotal}}', totalPrice);
    
    const fragment = htmlToFragment(html);
    
    // Injecter les articles
    const itemsSlot = fragment.querySelector('slot[name="items"]');
    if (itemsSlot) {
        const itemsList = V.createItemsList();
        itemsSlot.replaceWith(itemsList);
    }
    
    return fragment;
};

/**
 * Crée la liste des articles
 */
V.createItemsList = function() {
    const fragment = document.createDocumentFragment();
    
    M.cart.forEach(item => {
        const itemDOM = V.createItemDOM(item);
        fragment.appendChild(itemDOM);
    });
    
    return fragment;
};

/**
 * Crée le DOM d'un article
 */
V.createItemDOM = function(item) {
    let html = itemTemplate;
    
    // Remplacer les placeholders avec replaceAll
    html = html.replaceAll('{{id}}', item.id);
    html = html.replaceAll('{{image}}', item.image || '/placeholder.png');
    html = html.replaceAll('{{name}}', item.name);
    html = html.replaceAll('{{unitPrice}}', item.price.toFixed(2));
    html = html.replaceAll('{{quantity}}', item.quantity);
    
    // Calculer le total de ligne
    const lineTotal = (item.price * item.quantity).toFixed(2);
    html = html.replaceAll('{{lineTotal}}', lineTotal);

    return htmlToFragment(html).firstElementChild;
};

/**
 * Attache les event listeners
 */
V.attachEvents = function(fragment) {
    // Écouter les changements de quantité
    const inputs = fragment.querySelectorAll('input[data-qty]');
    inputs.forEach(input => {
        // 'input' se déclenche immédiatement (flèches ↑↓, saisie clavier)
        input.addEventListener('input', C.handleQuantityChange);
        // 'change' se déclenche quand on quitte le champ (backup)
        input.addEventListener('change', C.handleQuantityChange);
    });
    
    // Boutons d'augmentation de quantité
    const increaseBtns = fragment.querySelectorAll('button[data-increase]');
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', C.handleIncrease);
    });
    
    // Boutons de diminution de quantité
    const decreaseBtns = fragment.querySelectorAll('button[data-decrease]');
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', C.handleDecrease);
    });
    
    // Boutons de suppression
    const removeBtns = fragment.querySelectorAll('button[data-remove]');
    console.log('Boutons de suppression trouvés:', removeBtns.length);
    removeBtns.forEach(btn => {
        btn.addEventListener('click', C.handleRemoveItem);
    });
    
    // Bouton fermer (×)
    const closeBtn = fragment.querySelector('button.text-3xl');
    if (closeBtn) {
        closeBtn.addEventListener('click', C.handleClose);
    }
    
    // Bouton PAYER
    const payBtns = fragment.querySelectorAll('button');
    payBtns.forEach(btn => {
        if (btn.textContent.trim() === 'PAYER') {
            btn.addEventListener('click', C.handlePayment);
        }
    });
};

/**
 * Rafraîchit le contenu du panier
 */
V.refreshCartContent = async function() {
    M.cart = await CartData.getCart();
    
    // Trouver le conteneur du panier par son ID unique
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) {
        console.error('Conteneur du panier non trouvé');
        return;
    }
    
    // Trouver le header du panier
    const headerDiv = document.getElementById('cart-header');
    if (!headerDiv) {
        console.error('Header du panier non trouvé');
        return;
    }
    
    // Supprimer tout le contenu après le header
    let nextElement = headerDiv.nextElementSibling;
    while (nextElement) {
        const toRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        toRemove.remove();
    }
    
    // Injecter le nouveau contenu
    if (M.cart.length === 0) {
        // Panier vide
        const emptyContent = htmlToFragment(emptyTemplate);
        cartContainer.appendChild(emptyContent);
    } else {
        // Panier avec articles
        const cartContent = await V.createCartContent();
        cartContainer.appendChild(cartContent);
        
        // Ré-attacher les événements sur le nouveau contenu
        V.attachEvents(cartContainer);
    }
};

export function CartPage() {
    return C.init();
}
