import { AuthData } from './auth.js';

let CartData = {};

let items = [];
let currentUserId = null;

// Obtenir la clé de stockage pour l'utilisateur actuel
async function getStorageKey() {
    // Si on n'a pas encore récupéré l'userId, on le fait
    if (currentUserId === null) {
        try {
            const authResult = await AuthData.Auth();
            if (authResult && authResult.auth && authResult.id) {
                currentUserId = authResult.id;
            } else {
                currentUserId = 'guest'; // Utilisateur non connecté
            }
        } catch (err) {
            currentUserId = 'guest';
        }
    }
    return `cart_${currentUserId}`;
}

// Charger le panier
async function load() {
    const key = await getStorageKey();
    let stored = localStorage.getItem(key);
    if (stored) {
        items = JSON.parse(stored);
    } else {
        items = [];
    }
}

// Sauvegarder le panier
async function save() {
    const key = await getStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
}

// Calculer les totaux
async function calcTotals() {
    // Recharger depuis localStorage pour garantir les données à jour
    await load();
    
    console.log('📊 Calcul des totaux avec items:', items);
    
    let subtotal = 0;
    for (let item of items) {
        console.log(`  Item: ${item.name} | Prix: ${item.price} | Qté: ${item.quantity} | Ligne: ${item.price * item.quantity}`);
        subtotal += item.price * item.quantity;
    }
    
    let shipping = 0; // Pas de frais de livraison
    let total = subtotal + shipping;
    
    console.log(`  💰 Sous-total: ${subtotal} | Livraison: ${shipping} | TOTAL: ${total}`);
    
    return { subtotal, shipping, total };
}

// Ajouter un produit
CartData.addItem = async function(product) {
    await load();
    const existing = items.find(item => item.id === product.id);
    
    if (existing) {
        if (existing.quantity < 5) {
            existing.quantity++;
        }
    } else {
        items.push({
            id: product.id,
            name: product.name || 'Produit',
            description: product.description || '',
            image: product.image || 'default.png',
            price: product.price || 0,
            quantity: 1
        });
    }
    
    await save();
    return true;
};

// Changer la quantité
CartData.updateQuantity = async function(productId, quantity) {
    await load(); // Charger d'abord pour avoir les dernières données
    console.log(`🔄 updateQuantity - ID: ${productId}, Nouvelle quantité: ${quantity}`);
    let item = items.find(item => item.id === productId);
    if (item) {
        console.log(`  Avant: ${item.name} - Qté: ${item.quantity}`);
        item.quantity = parseInt(quantity); // S'assurer que c'est un nombre
        console.log(`  Après: ${item.name} - Qté: ${item.quantity}`);
        await save();
    } else {
        console.error(`  ❌ Item avec ID ${productId} non trouvé!`);
    }
};

// Supprimer un article
CartData.removeItem = async function(productId) {
    await load();
    items = items.filter(item => item.id !== productId);
    await save();
};

// Vider le panier
CartData.clear = async function() {
    items = [];
    await save();
};

// Vider le panier (alias)
CartData.clearCart = async function() {
    items = [];
    await save();
};

// Récupérer les articles
CartData.getItems = async function() {
    await load(); // Recharger depuis localStorage pour avoir les données à jour
    return items;
};

// Alias pour getItems (utilisé par Cart/page.js)
CartData.getCart = async function() {
    await load(); // Recharger depuis localStorage pour avoir les données à jour
    return items;
};

// Compter les articles
CartData.getItemCount = async function() {
    await load(); // Recharger depuis localStorage pour avoir les données à jour
    let count = 0;
    for (let item of items) {
        count += item.quantity;
    }
    return count;
};

// Alias pour getItemCount
CartData.getTotalItems = async function() {
    return await CartData.getItemCount();
};

// Obtenir le prix total
CartData.getTotalPrice = async function() {
    let totals = await calcTotals();
    return totals.total;
};

// Panier vide ?
CartData.isEmpty = async function() {
    await load(); // Recharger depuis localStorage pour avoir les données à jour
    return items.length === 0;
};

// Alias pour removeItem (utilisé par Cart/page.js)
CartData.removeProduct = async function(productId) {
    await load();
    items = items.filter(item => item.id !== productId);
    await save();
};

// État complet
CartData.getState = async function() {
    let totals = await calcTotals();
    return {
        items: items,
        itemCount: await CartData.getItemCount(),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        total: totals.total,
        isEmpty: items.length === 0
    };
};

// Charger au démarrage
// Note: load() sera appelé lors du premier getCart() ou autre méthode

export { CartData };