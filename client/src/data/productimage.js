import { getRequest } from '../lib/api-request.js';

let ProductImageData = {};

let fakeImages = [
    { id: 1, name: "marteau1.png", product_id: 1 },
    { id: 2, name: "marteau2.png", product_id: 1 },
    { id: 3, name: "tournevis1.png", product_id: 2 },
    { id: 4, name: "cle_molette1.png", product_id: 3 },
];

ProductImageData.fetch = async function(id){
    let data = await getRequest('productimages/' + id);
    return data == false ? [] : [data];
}

ProductImageData.fetchAll = async function(){
    let data = await getRequest('productimages');
    return data == false ? fakeImages : data;
}
export { ProductImageData };