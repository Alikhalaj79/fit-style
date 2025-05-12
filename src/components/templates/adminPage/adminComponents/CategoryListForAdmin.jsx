import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../../services/admin";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CategoryListForAdmin = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });
  // console.log(data, isLoading, error);
  const categories = data?.data?.data?.categories;
  console.log(categories);

  const renderCategories = (categories) =>
    categories.map((category) => (
      <Accordion
        key={category._id}
        sx={{
          width: {
            xs: "100%",
            sm: "75%",
            md: "50%",
          },
        }}
      >
        <AccordionSummary
          expandIcon={category?.children?.length ? <ExpandMoreIcon /> : null}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {category.title}
        </AccordionSummary>
        {category?.children?.length > 0 && (
          <AccordionDetails>
            {renderCategories(category.children)}
          </AccordionDetails>
        )}
      </Accordion>
    ));
  return (
    <div>
      <Typography variant="h6" mb={2}>
        دسته بندی ها
      </Typography>
      {isLoading ? <h3>Loading ...</h3> : renderCategories(categories)}
    </div>
  );
};

export default CategoryListForAdmin;
