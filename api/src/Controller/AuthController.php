<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";

class AuthController extends EntityController {
    
    private $users;

    public function __construct(){
        $this->users = new UserRepository();
    }

    /**
     * POST /api/auth/login → Authentification
     * Crée une session authentifiée
     */
    protected function processPostRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        // ✅ POST /auth/login → Authentification
        if ($id === "login") {
            $json = $request->getJson();
            $data = is_string($json) ? json_decode($json) : $json;

            if (!isset($data->email) || !isset($data->password)) {
                http_response_code(400);
                return ["error" => "Email et mot de passe requis"];
            }

            $user = $this->users->findByEmail($data->email);
            
            if (!$user || !password_verify($data->password, $user->getPassword())) {
                http_response_code(401);
                return ["error" => "Email ou mot de passe incorrect"];
            }

            if (session_status() === PHP_SESSION_NONE) {
            session_start();
            }
            // ✅ Stocker les infos en session
            $_SESSION['id'] = $user->getId();
            $_SESSION['email'] = $user->getEmail();
            $_SESSION['username'] = $user->getUsername();

            return [
                "success" => true,
                "message" => "Connexion réussie",
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "username" => $user->getUsername()
            ];
        }
        
        // ✅ POST /auth/logout → Déconnexion
        if ($id === "logout") {
            $_SESSION = array();
            
            if (isset($_COOKIE[session_name()])) {
                setcookie(session_name(), '', time()-3600, '/');
            }
            
            session_destroy();
            
            return ["success" => true, "message" => "Déconnexion réussie"];
        }
        
        http_response_code(404);
        return ["error" => "Endpoint non trouvé"];
    }

    /**
     * GET /api/auth → Vérifier l'authentification
     */
    protected function processGetRequest(HttpRequest $request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (isset($_SESSION['id'])) {
            $user = $this->users->find($_SESSION['id']);
            
            if ($user) {
                return [
                    "auth" => true,
                    "id" => $user->getId(),
                    "email" => $user->getEmail(),
                    "username" => $user->getUsername()
                ];
            }
        }
        
        return ["auth" => false];
    }
}
?>