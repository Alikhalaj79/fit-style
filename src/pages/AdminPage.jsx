import React from "react";
import CategoryListForAdmin from "../components/templates/adminPage/adminComponents/CategoryListForAdmin";
import CategoryForm from "../components/templates/adminPage/adminComponents/CategoryForm";
import DeleteCategory from "../components/templates/adminPage/adminComponents/DeleteCategory";
import AddProductForm from "../components/templates/adminPage/adminComponents/AddProductsForm";
import ProductsView from "../components/templates/adminPage/ProductsView";
import Container from "@mui/material/Container";

const AdminPage = () => {
  return (
    <div style={{ marginTop: "100px" }}>
      <Container fixed>
        <CategoryListForAdmin />
        <br />
        <hr />
        <CategoryForm />
        <br />
        <hr />
        <DeleteCategory />
        <br />
        <hr />
        <AddProductForm />
        <br />
        <hr />
        <ProductsView />
      </Container>
    </div>
  );
};

export default AdminPage;
