import React from 'react';
import Banner from '../components/templates/homePage/Banner';
import CategorySlider from '../components/templates/homePage/CategorySlider';
import ProductsSection from '../components/templates/homePage/ProductsSection';
import Video from '../components/templates/homePage/Video';
import SecondProductSection from '../components/templates/homePage/SecondProductSection';

const Homepage = () => {

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