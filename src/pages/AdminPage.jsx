import React from 'react';
import CategoryListForAdmin from '../components/templates/CategoryListForAdmin';
import CategoryForm from '../components/templates/CategoryForm';
import DeleteCategory from '../components/templates/DeleteCategory';
import AddProductForm from '../components/templates/AddProductsForm';


const AdminPage = () => {
    
    return (
      <div style={{ marginTop: "100px" }}>
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
      </div>
    );
};

export default AdminPage;