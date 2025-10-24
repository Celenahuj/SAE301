<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

// This class inherits the jsonResponse method and the $cnx property from the parent class EntityController
// Only the process????Request methods need to be (re)defined.

class UserController extends EntityController {

    private $users;

    public function __construct(){
        $this->users = new UserRepository();
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 86400);
            ini_set('session.cookie_path', '/');
            ini_set('session.cookie_httponly', true);
            ini_set('session.cookie_samesite', 'Lax');
            ini_set('session.cookie_secure', false);
            
            session_start();
        }
    }

   
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        if ($id){
            // URI is .../users/{id}
            $u = $this->users->find($id);
            return $u == null ? false : $u;
        }
        else{
            // URI is .../users
            // Retourne tous les utilisateurs
            return $this->users->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $data = is_string($json) ? json_decode($json) : $json;

        // ✅ Vérifier que tous les champs requis sont présents (utiliser OR)
        if (!isset($data->email) || !isset($data->username) || !isset($data->password)) {
            http_response_code(400);
            return ["error" => "Champs manquants pour la création du compte"];
        }

        // Vérifier si l'email existe déjà
        $existingUser = $this->users->findByEmail($data->email);
        if ($existingUser != null){
            http_response_code(409);
            return ["error" => "Cet email est déjà utilisé"];
        }
            
        $u = new User(0);
        $u->setEmail($data->email);
        $u->setUsername($data->username);
        $u->setPassword(password_hash($data->password, PASSWORD_DEFAULT));
                
        $ok = $this->users->save($u);
        if ($ok){
            return [
                    "id" => $u->getId(),
                    "email" => $u->getEmail(),
                    "username" => $u->getUsername(),
                ];
            }
            
        http_response_code(500);
        return ["error" => "Erreur lors de la création du compte"];
    }

    protected function processDeleteRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            $ok = $this->users->delete($id);
            return $ok ? ["success" => true] : false;
        }
        return false;
    }


    protected function processPatchRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        // ✅ Vérifier que l'ID existe
        if (!$id) {
            http_response_code(400);
            return ["error" => "ID utilisateur manquant"];
        }

        // ✅ Chercher l'utilisateur UNE SEULE FOIS
        $u = $this->users->find($id);
        
        if ($u == null) {
            http_response_code(404);
            return ["error" => "Utilisateur non trouvé"];
        }

        // ✅ Récupérer les données JSON
        $json = $request->getJson();
        $obj = json_decode($json);

        if (!$obj) {
            http_response_code(400);
            return ["error" => "Données JSON invalides"];
        }

        // ✅ Mise à jour des champs fournis (PATCH = mise à jour partielle)
        if (isset($obj->email)) {
            $u->setEmail($obj->email);
        }
        
        if (isset($obj->username)) {
            $u->setUsername($obj->username);
        }
        
        if (isset($obj->password) && !empty($obj->password)) {
            // Hash du nouveau mot de passe
            $hashedPassword = password_hash($obj->password, PASSWORD_DEFAULT);
            $u->setPassword($hashedPassword);
        }

        // ✅ Sauvegarder en base de données
        $ok = $this->users->update($u);

        if (!$ok) {
            http_response_code(500);
            return ["error" => "Erreur lors de la mise à jour en base de données"];
        }

        // ✅ Retourner l'utilisateur mis à jour
        return [
            "id" => $u->getId(),
            "email" => $u->getEmail(),
            "username" => $u->getUsername()
        ];
    }
    
    protected function processPutRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            $u = $this->users->find($id);
            if ($u == null) return false;
            
            $json = $request->getJson();
            $obj = json_decode($json);
            
            $u->setEmail($obj->email);
            $u->setUsername($obj->username);
            
            if (isset($obj->password)) {
                // Hash du nouveau mot de passe
                $hashedPassword = password_hash($obj->password, PASSWORD_DEFAULT);
                $u->setPassword($hashedPassword);
            }
            
            $ok = $this->users->update($u);
            return $ok ? $u : false;
        }
        return false;
    }
}

?>