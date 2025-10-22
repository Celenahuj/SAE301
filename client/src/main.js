import './global.css'
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { SignupPage } from "./pages/Signup/index.js";
import { LoginPage } from "./pages/Login/index.js";
import { ProfilePage } from "./pages/Profile/page.js";
import { UserData } from "./data/user.js";

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";


const router = new Router('app', { loginPath: '/login' });

window.router = router;

// Vérifier si l'utilisateur est déjà connecté
async function init() {
  try {
    console.log("🔍 Vérification de la session...");
    const data = await UserData.Auth();
    console.log("📦 Réponse Auth:", data);
    
    if (data && data.auth === true) {
      console.log("✅ Session active pour:", data.email);
      router.setAuth(true);
    } else {
      console.log("❌ Aucune session active");
    }
  } catch (error) {
    console.error("💥 Erreur:", error);
  }
  router.start();
}

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/login", LoginPage, { useLayout: false });
router.addRoute("/signup", SignupPage, { useLayout: false });
router.addRoute("/products/categories/:id", ProductsPage);
router.addRoute("/profile", ProfilePage, { requireAuth: true });

router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("*", The404Page);



init();

