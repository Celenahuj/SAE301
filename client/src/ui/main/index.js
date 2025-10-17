// import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// NavView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
let MainView = {
  html: function (data) {
    let html = template;
    for(let cat of data){
      html = html.replace(/{{id}}/g, cat.id);
    }
    return html;
  },

  //   return genericRenderer(template, data);
  // },

  dom: function (data) {
    return htmlToFragment(MainView.html(data));
  }
};
export { MainView };
