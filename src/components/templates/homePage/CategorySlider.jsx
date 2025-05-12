import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getCategories } from "../../../services/admin";
import mensShirt from "../../../assets/saticCategories/mens-shirt.jpeg";
import mensTshirt from "../../../assets/saticCategories/mens-tshirt.jpg";
import mensPants from "../../../assets/saticCategories/mens-pants.jpg";
import mensCosts from "../../../assets/saticCategories/mens-costs.jpg";
import mensAccessory from "../../../assets/saticCategories/mens-accessory.jpg";
import womensManto from "../../../assets/saticCategories/womens-manto.jpg";
import womensShoomiz from "../../../assets/saticCategories/womens-shoomiz.jpg";
import womensSkrit from "../../../assets/saticCategories/womens-skrit.jpg";
import womensCoats from "../../../assets/saticCategories/womens-coats.jpg";
import womensPants from "../../../assets/saticCategories/womens-pants.jpg";
import womensAccessory from "../../../assets/saticCategories/womens-accessory.jpg";

const categoryImages = {
  "shirt": mensShirt,
  "t-shirt": mensTshirt,
  "shalvar": mensPants,
  "kot-o-jakat": mensCosts,
  "accessory": mensAccessory,
  "manto": womensManto,
  "shoomiz": womensShoomiz,
  "daman": womensSkrit,
  "kot-va-palto": womensCoats,
  "shalvar-zananeh": womensPants,
  "accessoryz": womensAccessory,
};


const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count); 
};

const CategorySlider = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });

  const categories = data?.data?.data?.categories || [];
  const allChildren = categories.flatMap((cat) => cat.children || []); // get all children
  const randomCategories = getRandomItems(allChildren, 6); //get 6 random items

  // console.log(categories);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>خطا در دریافت اطلاعات</Typography>;

  return (
    <Box sx={{ mt: 10,mb:5, px: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        دسته‌ بندی‌ های پیشنهادی
      </Typography>
      <Swiper
        slidesPerView={3}
        spaceBetween={15}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{
          0: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
        }}
      >
        {randomCategories.map((category) => (
          <SwiperSlide key={category._id}>
            <Link
              to={`/categories/${category._id}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5",
                  borderRadius: 3,
                  padding: 2,
                  height: 300, 
                }}
              >
                <img
                  src={
                    categoryImages[category.slug] ||
                    "/staticCategories/default.jpg"
                  }
                  alt={category.title}
                  style={{
                    width: "200px", 
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "15px", 
                    marginBottom: "10px", 
                  }}
                />
                <Typography variant="body1" fontWeight="bold" sx={{mt:3}}>
                  {category.title}
                </Typography>
              </Box>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default CategorySlider;
