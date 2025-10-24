import { ProductData } from "../../data/product.js";
import { ProductImageData } from "../../data/productimage.js";
import { CartData } from "../../data/cart.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import { GalleryView } from "../../ui/gallery/index.js";
import template from "./template.html?raw";

let M = {
  products: [],
  productImages: [],
  currentProduct: null
};

M.getProductById = function (id) {
  return M.products.find((product) => product.id == id);
};

M.getImagesByProductId = function (id) {
  let images = [];
  for (let i = 0; i < M.productImages.length; i++) {
    let img = M.productImages[i];
    if (img.product_id == id) {
      img.src = "/" + img.name;
      images.push(img);
    }
  }
  return images;
};

let C = {};

C.handler_clickOnProduct = async function (ev) {
  if (ev.target.dataset.buy !== undefined) {
    let id = ev.target.dataset.buy;
    
    // Utiliser le produit stocké dans M
    if (M.currentProduct) {
      await CartData.addItem({
        id: M.currentProduct.id,
        name: M.currentProduct.name,
        description: M.currentProduct.description || '',
        image: M.currentProduct.image ? `/${M.currentProduct.image}` : '/placeholder.png',
        price: parseFloat(M.currentProduct.price) || 0
      });
      
      alert(`✅ "${M.currentProduct.name}" ajouté au panier !`);
    }
  }
};

C.handler_clickOnBack = function (ev) {
  ev.preventDefault();
  history.back();
};

C.handler_clickOnGalleryImage = function (ev) {
  if (ev.target.classList.contains("gallery-image")) {
    const mainImage = document.querySelector("#main-image");
    if (mainImage) {
      mainImage.src = ev.target.dataset.image;
    }
  }
};

C.init = async function (params) {
  const productId = params.id;

  // Charger tous les produits
  M.products = await ProductData.fetchAll();

  // Charger toutes les images
  M.productImages = await ProductImageData.fetchAll();

  // Récupérer le produit courant
  let p = M.getProductById(productId);

  // Attacher les images au produit
  if (p) {
    p.images = M.getImagesByProductId(productId);
    M.currentProduct = p; // Stocker pour le handler
  }

  return V.init(p);
};

let V = {};

V.init = function (data) {
  let fragment = V.createPageFragment(data);
  V.attachEvents(fragment);
  return fragment;
};

V.createPageFragment = function (data) {
  let pageFragment = htmlToFragment(template);
  
  // Créer le DOM du composant detail
  let detailDOM = DetailView.dom(data);
  
  // Créer le DOM du composant gallery
  let galleryDOM = GalleryView.dom(data);

  // Remplacer les slots
  const detailSlot = pageFragment.querySelector('slot[name="detail"]');
  if (detailSlot) detailSlot.replaceWith(detailDOM);

  const gallerySlot = pageFragment.querySelector('slot[name="gallery"]');
  if (gallerySlot) gallerySlot.replaceWith(galleryDOM);

  return pageFragment;
};

V.attachEvents = function (pageFragment) {
  const addToCartBtn = pageFragment.querySelector("[data-buy]");
  addToCartBtn.addEventListener("click", C.handler_clickOnProduct);

  const backBtn = pageFragment.querySelector("#btnRetour");
  if (backBtn) {
    backBtn.addEventListener("click", C.handler_clickOnBack);
  }

  // Ajouter l'événement pour changer l'image principale
  const gallery = pageFragment.querySelector(".product-gallery");
  if (gallery) {
    gallery.addEventListener("click", C.handler_clickOnGalleryImage);
  }

  return pageFragment;
};

export function ProductDetailPage(params) {
  console.log("ProductDetailPage", params);
  return C.init(params);
}