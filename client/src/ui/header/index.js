import { htmlToFragment } from "../../lib/utils.js";
import { MainView } from "../main/index.js";
import template from "./template.html?raw";

let HeaderView = {
  html() {
    let mainHtml = MainView.html();
    console.log(mainHtml);
    return template.replace('<slot name="categories-nav"></slot>', mainHtml);
  },

  dom() {
    let fragment = htmlToFragment(template);
    
    // Ajouter navigation desktop
    let slot = fragment.querySelector('slot[name="categories-nav"]');
    if (slot) slot.replaceWith(MainView.dom());
    
    // Ajouter navigation mobile
    let slotMobile = fragment.querySelector('slot[name="categories-nav-mobile"]');
    if (slotMobile) slotMobile.replaceWith(MainView.dom());
    
    // Gérer le menu burger
    setTimeout(() => {
      const burgerBtn = document.getElementById('burger-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (burgerBtn) {
        burgerBtn.onclick = () => {
          mobileMenu.classList.toggle('hidden');
          
          // Animer les barres du burger
          const spans = burgerBtn.querySelectorAll('span');
          const isOpen = !mobileMenu.classList.contains('hidden');
          
          spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 7px)' : 'none';
          spans[1].style.opacity = isOpen ? '0' : '1';
          spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -7px)' : 'none';
        };
      }
    }, 100);
    
    return fragment;
  }
};

export { HeaderView };