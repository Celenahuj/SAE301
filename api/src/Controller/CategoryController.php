<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/CategoryRepository.php";

class CategoryController extends EntityController {
    private CategoryRepository $categories;

    public function __construct(){
        $this->categories = new CategoryRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            // URI is .../categories/{id}
            $c = $this->categories->find($id);
            return $c==null ? false : $c;
        }
        else{
            // URI is .../categories
            return $this->categories->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);
        $c = new Category(0);
        $c->setName($obj->name);
        $c->setImage($obj->image);
        $ok = $this->categories->save($c);
        return $ok ? $c : false;
    }
}
?>