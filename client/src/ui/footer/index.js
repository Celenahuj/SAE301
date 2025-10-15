import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let FooterView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    return htmlToFragment( FooterView.html(data) );
  }

};

export { FooterView };