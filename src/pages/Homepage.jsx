import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Banner from "../components/templates/homePage/Banner";
import CategorySlider from "../components/templates/homePage/CategorySlider";
import ProductsSection from "../components/templates/homePage/ProductsSection";
import Video from "../components/templates/homePage/Video";
import SecondProductSection from "../components/templates/homePage/SecondProductSection";
import { useToast } from "../contexts/ToastContext";

const Homepage = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "success") {
      showToast("پرداخت با موفقیت انجام شد! سفارش شما ثبت گردید.", "success");

      // Clean up URL parameter
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete("payment");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, showToast]);

  return (
    <div>
      <Banner />
      <CategorySlider />
      <ProductsSection />
      <Video />
      <SecondProductSection />
    </div>
  );
};

export default Homepage;
