<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/ProductImageRepository.php";

class ProductImageController extends EntityController {
    private ProductImageRepository $productImages;

    public function __construct(){
        $this->productImages = new ProductImageRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        if ($id){
            // URI is .../productimages/{id}
            $img = $this->productImages->find($id);
            return $img == null ? false : $img;
        }
        else{
            // URI is .../productimages
            // Vérifier s'il y a un paramètre product_id pour filtrer
            $productId = $request->getParam("product_id");
            
            if ($productId == false) {
                // Retourner toutes les images
                return $this->productImages->findAll();
            } else {
                // Retourner les images d'un produit spécifique
                return $this->productImages->findByProductId($productId);
            }
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);
        
        $img = new ProductImage(0);
        $img->setProductId($obj->product_id);
        $img->setName($obj->name);
        
        $ok = $this->productImages->save($img);
        return $ok ? $img : false;
    }
}
?>