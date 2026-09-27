import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { NavLayout } from "../components/layout/NavLayout";
import { Home } from "../pages/Home";
import { Catalog } from "../pages/Catalog";

const Favorites = lazy(() => import("../pages/Favorites").then((m) => ({ default: m.Favorites })));
const Cart = lazy(() => import("../pages/Cart").then((m) => ({ default: m.Cart })));
const RccClub = lazy(() => import("../pages/RccClub").then((m) => ({ default: m.RccClub })));
const Orders = lazy(() => import("../pages/Orders").then((m) => ({ default: m.Orders })));
const Sizes = lazy(() => import("../pages/Sizes").then((m) => ({ default: m.Sizes })));
const Addresses = lazy(() => import("../pages/Addresses").then((m) => ({ default: m.Addresses })));
const Support = lazy(() => import("../pages/Support").then((m) => ({ default: m.Support })));
const ProductPage = lazy(() => import("../pages/ProductPage").then((m) => ({ default: m.ProductPage })));
const Checkout = lazy(() => import("../pages/Checkout").then((m) => ({ default: m.Checkout })));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess").then((m) => ({ default: m.OrderSuccess })));
const Search = lazy(() => import("../pages/Search").then((m) => ({ default: m.Search })));

function RouteFallback() {
  return <div style={{ minHeight: "100dvh", background: "var(--color-white)" }} />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<RccClub />} />
          <Route path="/profile/orders" element={<Orders />} />
          <Route path="/profile/sizes" element={<Sizes />} />
          <Route path="/profile/addresses" element={<Addresses />} />
          <Route path="/profile/support" element={<Support />} />
        </Route>
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Suspense>
  );
}
