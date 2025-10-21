<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";


// This class inherits the jsonResponse method and the $cnx property from the parent class EntityController
// Only the process????Request methods need to be (re)defined.

class UserController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
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
        // Vérifier si les données viennent de FormData (POST classique)
        if (isset($_POST['email']) && isset($_POST['username']) && isset($_POST['password'])) {
            $u = new User(0); // 0 is a symbolic and temporary value since the user does not have a real id yet.
            $u->setEmail($_POST['email']);
            $u->setUsername($_POST['username']);
            
            // Hash du mot de passe avant de le sauvegarder
            $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $u->setPassword($hashedPassword);
            
            $ok = $this->users->save($u);
            return $ok ? $u : false;
        }
        
        return false; // Si les données ne sont pas présentes
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
        if ($id){
            $u = $this->users->find($id);
            if ($u == null) return false;
            
            $json = $request->getJson();
            $obj = json_decode($json);
            
            // Mise à jour des champs fournis
            if (isset($obj->email)) {
                $u->setEmail($obj->email);
            }
            if (isset($obj->username)) {
                $u->setUsername($obj->username);
            }
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