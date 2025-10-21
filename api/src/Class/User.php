<?php

require_once ('Entity.php');

/**
 *  Class User
 * 
 *  Représente un utilisateur avec les propriétés (id, email, password, username)
 * 
 *  Implémente l'interface JsonSerializable 
 *  qui oblige à définir une méthode jsonSerialize. Cette méthode permet de dire comment les objets
 *  de la classe User doivent être converti en JSON.
 */
class User extends Entity {
    private int $id; // id de l'utilisateur
    private ?string $email = null; // email de l'utilisateur (nullable pour éviter erreur si non initialisé)
    private ?string $password = null; // mot de passe de l'utilisateur (nullable)
    private ?string $username = null; // nom d'utilisateur (nullable)

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
     *  Define how to convert/serialize a User to a JSON format
     *  This method will be automatically invoked by json_encode when apply to a User
     *  
     *  Note: Le mot de passe n'est pas inclus dans la sérialisation JSON pour des raisons de sécurité
     */
    public function jsonSerialize(): mixed{
        return [
            "id" => $this->id,
            "email" => $this->email,
            "username" => $this->username
            // Le password n'est volontairement pas inclus pour des raisons de sécurité
        ];
    }

    /**
     * Get the value of email
     */ 
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @return  self
     */ 
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get the value of password
     */ 
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * Set the value of password
     *
     * @return  self
     */ 
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * Get the value of username
     */ 
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * Set the value of username
     *
     * @return  self
     */ 
    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }
}

?>
