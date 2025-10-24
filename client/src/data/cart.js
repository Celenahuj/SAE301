import { AuthData } from './auth.js';

let CartData = {};

let items = [];
let currentUserId = null;


async function getStorageKey() {

    if (currentUserId === null) {
        try {
            const authResult = await AuthData.Auth();
            if (authResult && authResult.auth && authResult.id) {
                currentUserId = authResult.id;
            } else {
                currentUserId = 'guest'; 
            }
        } catch (err) {
            currentUserId = 'guest';
        }
    }
    return `cart_${currentUserId}`;
}

async function load() {
    const key = await getStorageKey();
    let stored = localStorage.getItem(key);
    if (stored) {
        items = JSON.parse(stored);
    } else {
        items = [];
    }
}

async function save() {
    const key = await getStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
}


async function calcTotals() {

    await load();
    
    console.log(' Calcul des totaux avec items:', items);
    
    let subtotal = 0;
    for (let item of items) {
        console.log(`  Item: ${item.name} | Prix: ${item.price} | Qté: ${item.quantity} | Ligne: ${item.price * item.quantity}`);
        subtotal += item.price * item.quantity;
    }
    
    let shipping = 0;
    let total = subtotal + shipping;
    
    console.log(`  💰 Sous-total: ${subtotal} | Livraison: ${shipping} | TOTAL: ${total}`);
    
    return { subtotal, shipping, total };
}

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

CartData.updateQuantity = async function(productId, quantity) {
    await load(); 
    console.log(` updateQuantity - ID: ${productId}, Nouvelle quantité: ${quantity}`);
    let item = items.find(item => item.id === productId);
    if (item) {
        console.log(`  Avant: ${item.name} - Qté: ${item.quantity}`);
        item.quantity = parseInt(quantity); 
        console.log(`  Après: ${item.name} - Qté: ${item.quantity}`);
        await save();
    } else {
        console.error(`  Item avec ID ${productId} non trouvé!`);
    }
};


CartData.removeItem = async function(productId) {
    await load();
    items = items.filter(item => item.id !== productId);
    await save();
};


CartData.clear = async function() {
    items = [];
    await save();
};


CartData.clearCart = async function() {
    items = [];
    await save();
};


CartData.getItems = async function() {
    await load(); 
    return items;
};


CartData.getCart = async function() {
    await load(); 
    return items;
};


CartData.getItemCount = async function() {
    await load(); 
    let count = 0;
    for (let item of items) {
        count += item.quantity;
    }
    return count;
};


CartData.getTotalItems = async function() {
    return await CartData.getItemCount();
};


CartData.getTotalPrice = async function() {
    let totals = await calcTotals();
    return totals.total;
};

CartData.isEmpty = async function() {
    await load(); 
    return items.length === 0;
};


CartData.removeProduct = async function(productId) {
    await load();
    items = items.filter(item => item.id !== productId);
    await save();
};


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



export { CartData };