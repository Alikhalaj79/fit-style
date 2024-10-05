import { useQuery } from '@tanstack/react-query';
import React from 'react';
// import AuthPage from './AuthPage';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../services/users';

const Homepage = () => {
     const { data } = useQuery({queryKey: ["profile"],queryFn: getUserProfile,});

    return (
      <div>
        {data ? <Link to="/user">userPage</Link> : null}
        <br />
        {data && data.data.data.user.role=== "admin"?<Link to="/admin">adminPage</Link>:null}
        <h3>HomePage</h3>
        <Link to="/login">login</Link>
        {/* <AuthPage /> */}
      </div>
    );
};

export default Homepage;