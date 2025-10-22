import './global.css'
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { SignInPage } from "./pages/Signup/index.js";
import { LoginPage } from "./pages/Login/index.js";


import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";

// Exemple d'utilisation avec authentification

// const currentUser = UserData.getCurrentUser();
// if (currentUser) {
//     console.log('👤 Utilisateur déjà connecté:', currentUser.username);
//     router.setAuth(true);
// } else {
//     console.log('👤 Aucun utilisateur connecté');
//     router.setAuth(false);
// }

const router = new Router('app');

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/login", LoginPage, { useLayout: false });
router.addRoute("/signup", SignInPage, { useLayout: false });
router.addRoute("/products/categories/:id", ProductsPage);

router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("*", The404Page);

// Démarrer le routeur
router.start();

