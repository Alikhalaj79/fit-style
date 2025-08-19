import { useState } from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const ImageModal = ({
  open,
  onClose,
  imageSrc,
  imageAlt,
  images = [],
  currentImageIndex = 0,
  onImageChange,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleClose = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  const handlePrevious = () => {
    if (images.length > 1 && onImageChange) {
      const newIndex =
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
      onImageChange(newIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleNext = () => {
    if (images.length > 1 && onImageChange) {
      const newIndex =
        currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
      onImageChange(newIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          width: "auto",
          height: "auto",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Zoom Controls */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 10,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleZoomIn}
            disabled={scale >= 3}
            sx={{
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            sx={{
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Box>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}

        {/* Reset Button */}
        {scale !== 1 && (
          <IconButton
            onClick={handleReset}
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            Reset
          </IconButton>
        )}

        {/* Image */}
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: `scale(${scale}) translate(${position.x / scale}px, ${
              position.y / scale
            }px)`,
            transition: isDragging ? "none" : "transform 0.1s ease",
            userSelect: "none",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
