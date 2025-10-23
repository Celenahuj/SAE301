<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";

class AuthController extends EntityController {
    
    private $users;

    public function __construct(){
        $this->users = new UserRepository();
        
        // ✅ Configuration session
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 86400);
            ini_set('session.cookie_path', '/');
            ini_set('session.cookie_httponly', true);
            ini_set('session.cookie_samesite', 'None');
            ini_set('session.cookie_secure', false);
            
            session_start();
        }
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

            $_SESSION['authenticated'] = true;
            $_SESSION['user_id'] = $user->getId();

            return [
                "success" => true,
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
     * "Un simple appel à session_start suffira à restaurer la session en cours"
     */
    protected function processGetRequest(HttpRequest $request) {
        // ✅ La présence des données de session = preuve qu'il est authentifié
        if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true && isset($_SESSION['id'])) {
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
        
        // ✅ Absence des données = pas encore authentifié
        return ["auth" => false];
    }
}
?>