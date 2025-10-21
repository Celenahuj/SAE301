import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";

let GalleryView = {
  dom: function (data) {
    let html = template;

    // Générer le HTML de la galerie
    let galleryHTML = "";
    if (data.images && data.images.length > 0) {
      for (let img of data.images) {
        galleryHTML += `<img 
          src="${img.src}" 
          alt="Image ${img.id}" 
          class="gallery-image"
          data-image="${img.src}"
        >`;
      }
    }

    html = html.replace("{{gallery}}", galleryHTML);

    return htmlToFragment(html);
  },
};

export { GalleryView };