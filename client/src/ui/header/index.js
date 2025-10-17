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
    let slot = fragment.querySelector('slot[name="categories-nav"]');
    if (slot) slot.replaceWith(MainView.dom());
    return fragment;
  }
};

export { HeaderView };