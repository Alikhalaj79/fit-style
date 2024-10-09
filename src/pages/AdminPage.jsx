import React from 'react';
import CategoryListForAdmin from '../components/templates/CategoryListForAdmin';
import CategoryForm from '../components/templates/CategoryForm';
import DeleteCategory from '../components/templates/DeleteCategory';


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
      </div>
    );
};

export default AdminPage;