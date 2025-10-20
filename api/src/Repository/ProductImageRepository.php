<?php
require_once("src/Repository/EntityRepository.php");
require_once("src/Class/ProductImage.php");

class ProductImageRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?ProductImage {
        $requete = $this->cnx->prepare("SELECT * FROM ProductImage WHERE id=:id");
        $requete->bindParam(':id', $id);
        $requete->execute();
        $obj = $requete->fetch(PDO::FETCH_OBJ);
        if (!$obj) return null;
        $img = new ProductImage($obj->id);
        $img->setName($obj->name);
        $img->setProductId($obj->product_id);
        return $img;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM ProductImage");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        $res = [];
        foreach ($answer as $obj) {
            $img = new ProductImage($obj->id);
            $img->setName($obj->name);
            $img->setProductId($obj->product_id);
            $res[] = $img;
        }
        return $res;
    }

    public function save($img): bool {
        $requete = $this->cnx->prepare("INSERT INTO ProductImage (name, product_id) VALUES (:name, :product_id)");
        $name = $img->getName();
        $pid = $img->getProductId();
        $requete->bindParam(':name', $name);
        $requete->bindParam(':product_id', $pid);
        $ok = $requete->execute();
        if ($ok) {
            $img->setId($this->cnx->lastInsertId());
        }
        return $ok;
    }

    public function update($img): bool {
        $requete = $this->cnx->prepare("UPDATE ProductImage SET name=:name, product_id=:product_id WHERE id=:id");
        $id = $img->getId();
        $name = $img->getName();
        $pid = $img->getProductId();
        $requete->bindParam(':id', $id);
        $requete->bindParam(':name', $name);
        $requete->bindParam(':product_id', $pid);
        return $requete->execute();
    }

    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM ProductImage WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    // Méthode spécifique pour récupérer toutes les images d'un produit
    public function findByProductId($product_id): array {
        $requete = $this->cnx->prepare("SELECT * FROM ProductImage WHERE product_id=:product_id");
        $requete->bindParam(':product_id', $product_id);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        $res = [];
        foreach ($answer as $obj) {
            $img = new ProductImage($obj->id);
            $img->setName($obj->name);
            $img->setProductId($obj->product_id);
            $res[] = $img;
        }
        return $res;
    }
}
