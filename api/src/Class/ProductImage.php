<?php
require_once ('Entity.php');

/**
 *  Class ProductImage
 * 
 *  Représente une image de produit avec 3 propriétés (id, name, product_id)
 * 
 *  Implémente l'interface JsonSerializable 
 *  qui permet de convertir les objets ProductImage en JSON
 */
class ProductImage extends Entity {
    private int $id;
    private ?string $name = null;
    private ?int $product_id = null;

    public function __construct(int $id){
        $this->id = $id;
    }

    /**
     * Get the value of id
     */ 
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Set the value of id
     */ 
    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of name
     */ 
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * Set the value of name
     */ 
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get the value of product_id
     */ 
    public function getProductId(): ?int
    {
        return $this->product_id;
    }

    /**
     * Set the value of product_id
     */ 
    public function setProductId(int $product_id): self
    {
        $this->product_id = $product_id;
        return $this;
    }

    /**
     * Conversion en JSON
     */ 
    public function jsonSerialize(): mixed
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "product_id" => $this->product_id
        ];
    }
}
