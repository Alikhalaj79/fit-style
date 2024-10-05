import React from 'react';
import CategoryListForAdmin from '../components/templates/CategoryListForAdmin';
import CategoryForm from '../components/templates/CategoryForm';


const AdminPage = () => {
    
    return (
      <div style={{ marginTop: "100px" }}>
        <CategoryListForAdmin />
        <br />
        <hr />
        <CategoryForm />
      </div>
    );
};

export default AdminPage;