import { ProductData } from "../../data/product.js";
import { ProductImageData } from "../../data/productimage.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import { GalleryView } from "../../ui/gallery/index.js";
import template from "./template.html?raw";

let M = {
  products: [],
  productImages: [],
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

C.handler_clickOnProduct = function (ev) {
  if (ev.target.dataset.buy !== undefined) {
    let id = ev.target.dataset.buy;
    alert(`Produit ajouté au panier ! (Quand il y en aura un)`);
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