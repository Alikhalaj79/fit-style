import React, { useState } from "react";
import { Dialog, IconButton, CardMedia } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useSwipeable } from "react-swipeable";

const ImageModal = ({ images, openImage, handleCloseImage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  //  swipe setting
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
  });

  return (
    <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md">
      <div
        {...handlers} // swipe with touching
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardMedia
          component="img"
          crossOrigin="anonymous"
          sx={{
            height: { xs: "100%", sm: "400px", md: "600px" },
            width: "100%",
            objectFit: { xs: "contain", sm: "cover" },
          }}
          image={images[currentImageIndex]}
          alt={`Product image ${currentImageIndex + 1}`}
        />

        {/* change buttons */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 10,
                color: "white",
                zIndex: 1,
                boxShadow: "0px 4px 8px rgba(184, 170, 170, 0.5)",
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 10,
                color: "white",
                zIndex: 1,
                boxShadow: "0px 4px 8px rgba(184, 170, 170, 0.5)",
              }}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default ImageModal;
