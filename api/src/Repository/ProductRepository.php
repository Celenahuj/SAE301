<?php
require_once("src/Repository/EntityRepository.php");
require_once("src/Class/Product.php");


/**
 *  Classe ProductRepository
 * 
 *  Cette classe représente le "stock" de Product.
 *  Toutes les opérations sur les Product doivent se faire via cette classe 
 *  qui tient "synchro" la bdd en conséquence.
 * 
 *  La classe hérite de EntityRepository ce qui oblige à définir les méthodes  (find, findAll ... )
 *  Mais il est tout à fait possible d'ajouter des méthodes supplémentaires si
 *  c'est utile !
 *  
 */
class ProductRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?Product {
    $requete = $this->cnx->prepare("SELECT * FROM Product WHERE id=:value");
    $requete->bindParam(':value', $id);
    $requete->execute();
    $answer = $requete->fetch(PDO::FETCH_OBJ);
    
    if ($answer == false) return null;
    
    $p = new Product($answer->id);
    $p->setName($answer->name);
    $p->setIdcategory($answer->category);
    $p->setPrice($answer->price);
    $p->setImage($answer->image);
    $p->setDescription($answer->description);
    $p->setCalories($answer->calories);
    $p->setAllergens($answer->allergens);


    return $p;
}


    public function findAll(): array {
    $requete = $this->cnx->prepare("SELECT * FROM Product");
    $requete->execute();
    $answer = $requete->fetchAll(PDO::FETCH_OBJ);

    $res = [];

    $imgRepo = new ProductImageRepository();

    foreach($answer as $obj){
        $p = new Product($obj->id);
        $p->setName($obj->name);
        $p->setIdcategory($obj->category);
        $p->setPrice($obj->price);
        $p->setImage($obj->image);
        $p->setDescription($obj->description);
        $p->setCalories($obj->calories);
        $p->setAllergens($obj->allergens);

        $res[] = $p;
    }

    return $res;
}

    public function findAllByCategory($cat): array {
    $requete = $this->cnx->prepare("SELECT * FROM Product WHERE category = :idcategory");
    $requete->bindParam(':idcategory', $cat);
    $requete->execute();
    $answer = $requete->fetchAll(PDO::FETCH_OBJ);

    $res = [];

    $imgRepo = new ProductImageRepository();

    foreach($answer as $obj){
        $p = new Product($obj->id);
        $p->setName($obj->name);
        $p->setIdcategory($obj->category);
        $p->setPrice($obj->price);
        $p->setImage($obj->image); 
        $p->setDescription($obj->description);
        $p->setCalories($obj->calories);
        $p->setAllergens($obj->allergens);

        $res[] = $p;
    }

    return $res;
}

    public function save($product){
        $requete = $this->cnx->prepare("insert into Product (name, category) values (:name, :idcategory)");
        $name = $product->getName();
        $idcat = $product->getIdcategory();
        $requete->bindParam(':name', $name );
        $requete->bindParam(':idcategory', $cat);
        $answer = $requete->execute(); // an insert query returns true or false. $answer is a boolean.

        if ($answer){
            $id = $this->cnx->lastInsertId(); // retrieve the id of the last insert query
            $product->setId($id); // set the product id to its real value.
            return true;
        }
          
        return false;
    }
    public function delete($id){
        // Not implemented ! TODO when needed !
        return false;
    }

    public function update($product){
        // Not implemented ! TODO when needed !
        return false;
    }

   
    
}