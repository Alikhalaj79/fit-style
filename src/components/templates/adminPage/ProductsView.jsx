import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { getProducts } from "../../../services/productsApi";
import ProductCard from "./ProductCard";
import { CircularProgress, IconButton, useMediaQuery } from "@mui/material";
import { getUserProfile } from "../../../services/users";
import { useSwipeable } from "react-swipeable";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const ProductsView = () => {
  // snackbar(alert) for delete products
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
  });

  const isAdmin = profileData?.data?.data?.user.role === "admin";
  const containerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width:768px)");

  const handlers = useSwipeable({
    onSwipedLeft: () => handleScroll("right"),
    onSwipedRight: () => handleScroll("left"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    let startX = event.pageX;
    const onMouseMove = (e) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft -= e.pageX - startX;
        startX = e.pageX;
      }
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p>خطا در دریافت محصولات .</p>;

  const products = data?.data?.data?.products || [];

  return (
    <div style={{ position: "relative", padding: "10px" }}>
      {
        <IconButton
          onClick={() => handleScroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <ArrowBack />
        </IconButton>
      }

      <div
        {...handlers}
        ref={containerRef}
        style={{
          overflowX: isDesktop ? "hidden" : "auto",
          display: "flex",
          cursor: isDesktop ? "grab" : "auto",
          paddingBottom: "10px",
        }}
        onMouseDown={isDesktop ? handleMouseDown : null}
      >
        {products?.map((product) => (
          <div
            key={product.id}
            style={{
              minWidth: "300px",
              marginRight: "10px",
            }}
          >
            <ProductCard
              product={product}
              isAdmin={isAdmin}
              openSnackbar={openSnackbar}
              setOpenSnackbar={setOpenSnackbar}
              snackbarMessage={snackbarMessage}
              setSnackbarMessage={setSnackbarMessage}
              snackbarSeverity={snackbarSeverity}
              setSnackbarSeverity={setSnackbarSeverity}
            />
          </div>
        ))}
      </div>

      {
        <IconButton
          onClick={() => handleScroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <ArrowForward />
        </IconButton>
      }
    </div>
  );
};

export default ProductsView;
