import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import {
  convertPriceToPersian,
  getImageUrl,
} from "../../../services/productsApi";
import ImageModal from "./adminComponents/ImageModal";
import EditProductModal from "./adminComponents/EditProductModal";
import DeleteProductModal from "./adminComponents/DeleteProductModal";

const ProductCard = ({
  product,
  isAdmin,
  openSnackbar,
  setOpenSnackbar,
  snackbarMessage,
  setSnackbarMessage,
  snackbarSeverity,
  setSnackbarSeverity,
}) => {
  const [openImage, setOpenImage] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleEditSave = (updatedData) => {
    // Handle saving the updated product data (e.g., send PATCH request here)
    console.log("Updated data:", updatedData);
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", sm: 240, md: 300 },
        width: "100%",
        overflow: "hidden",
        margin: "16px",
      }}
    >
      {/* image with picture tag */}
      <Box
        sx={{
          height: { xs: 270, sm: 200, md: 280 },
          width: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <picture onClick={() => handleOpenImage(0)}>
          <source
            srcSet={getImageUrl(product?.images[0], "webp")}
            type="image/webp"
          />
          <img
            src={getImageUrl(product?.images[0]) || "placeholder.jpg"}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            loading="lazy"
            crossOrigin="anonymous"
          />
        </picture>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 2,
        }}
      >
        {/* show title */}
        <Typography gutterBottom variant="body1" component="p">
          {product.title}
        </Typography>

        {/* summary */}
        <Typography variant="body2" color="text.secondary">
          {product.summary}
        </Typography>

        {/* price */}
        <Typography variant="h6" component="p" color="primary" mt={2}>
          تومان {convertPriceToPersian(product.price)}
        </Typography>
      </CardContent>

      {/*buttons */}
      <CardActions sx={{ gap: 2, padding: 2 }}>
        {isAdmin ? (
          <>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleEditClick}
            >
              ویرایش
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={handleDelete}
            >
              حذف
            </Button>
          </>
        ) : (
          <Button size="small" color="primary" variant="contained">
            اضافه به سبد خرید
          </Button>
        )}
      </CardActions>
      {/* Modal for image gallery */}
      <ImageModal
        images={product.images.map((img) => getImageUrl(img))} // Pass images to modal
        openImage={openImage}
        handleCloseImage={handleCloseImage} // Close modal
      />
      {/* edit modal */}
      <EditProductModal
        openEditModal={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={product}
        onSave={handleEditSave}
      />
      <DeleteProductModal
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
        snackbarMessage={snackbarMessage}
        setSnackbarMessage={setSnackbarMessage}
        snackbarSeverity={snackbarSeverity}
        setSnackbarSeverity={setSnackbarSeverity}
        openDeleteModal={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        product={product}
      />
    </Card>
  );
};

export default ProductCard;
