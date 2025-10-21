import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let CardView = {
  html: function (data) {
    let htmlString = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-items-center">';
    for (let obj of data) {
      htmlString  += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment( CardView.html(data) );
  }

};

export { CardView };