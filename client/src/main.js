import './global.css'
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { SignupPage } from "./pages/Signup/page.js";
import { LoginPage } from "./pages/Login/page.js";
import { ProfilePage } from "./pages/Profile/page.js";

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";
import { AuthData } from './data/auth.js';


const router = new Router('app', { loginPath: '/login' });

window.router = router;

(async () => {
  const result = await AuthData.Auth();
  if (result && result.auth) {
    router.setAuth(true);
  }
  else {
    router.setAuth(false);
  }
})();

router.addLayout("/", RootLayout);

router.addRoute("/", ProductsPage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/login", LoginPage, { useLayout: false });
router.addRoute("/signup", SignupPage, { useLayout: false });
router.addRoute("/products/categories/:id", ProductsPage);
router.addRoute("/profile", ProfilePage, { requireAuth: true });

router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("*", The404Page);



router.start();

