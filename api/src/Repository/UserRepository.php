<?php
require_once("src/Repository/EntityRepository.php");
require_once("src/Class/User.php");


/**
 *  Classe UserRepository
 * 
 *  Cette classe représente le "stock" de User.
 *  Toutes les opérations sur les User doivent se faire via cette classe 
 *  qui tient "synchro" la bdd en conséquence.
 * 
 *  La classe hérite de EntityRepository ce qui oblige à définir les méthodes  (find, findAll ... )
 *  Mais il est tout à fait possible d'ajouter des méthodes supplémentaires si
 *  c'est utile !
 *  
 */
class UserRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setEmail($answer->email);
        $u->setPassword($answer->password);
        $u->setUsername($answer->username);

        return $u;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM User");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];

        foreach($answer as $obj){
            $u = new User($obj->id);
            $u->setEmail($obj->email);
            $u->setPassword($obj->password);
            $u->setUsername($obj->username);

            $res[] = $u;
        }

        return $res;
    }

    /**
     * Trouve un utilisateur par email
     * Utile pour l'authentification
     */
    public function findByEmail($email): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE email=:email");
        $requete->bindParam(':email', $email);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setEmail($answer->email);
        $u->setPassword($answer->password);
        $u->setUsername($answer->username);

        return $u;
    }

    public function save($user): bool {
    $requete = $this->cnx->prepare("INSERT INTO User (email, password, username) VALUES (:email, :password, :username)");
    $email = $user->getEmail();
    $password = $user->getPassword();
    $username = $user->getUsername();
    
    $requete->bindParam(':email', $email);
    $requete->bindParam(':password', $password);
    $requete->bindParam(':username', $username);
    
    $ok = $requete->execute();
    
    if ($ok){
        $id = $this->cnx->lastInsertId();
        $user->setId($id); 
    }
    
    return $ok;
}

    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM User WHERE id=:id");
        $requete->bindParam(':id', $id);
        $ok = $requete->execute();
        return $ok;
    }

    public function update($user): bool {
        $requete = $this->cnx->prepare("UPDATE User SET email=:email, password=:password, username=:username WHERE id=:id");
        $id = $user->getId();
        $email = $user->getEmail();
        $password = $user->getPassword();
        $username = $user->getUsername();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':email', $email);
        $requete->bindParam(':password', $password);
        $requete->bindParam(':username', $username);
        
        $ok = $requete->execute();
        return $ok;
    }
}
?>
