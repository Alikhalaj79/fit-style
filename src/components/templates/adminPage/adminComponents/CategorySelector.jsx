import React, { useState } from "react";
import {
  Box,
  MenuItem,
  IconButton,
  Collapse,
  FormControl,
  Select,
  InputLabel,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../../services/admin";

const CategorySelector = ({ formData, setFormData, labelText }) => {
  const [openCategories, setOpenCategories] = useState({});

  //get data from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });

  const categories = data?.data?.data?.categories || [];

  const handleToggle = (categoryId) => {
    setOpenCategories((prevOpen) => ({
      ...prevOpen,
      [categoryId]: !prevOpen[categoryId],
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, parent: categoryId });
  };

  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category._id} style={{ paddingLeft: level * 16 }}>
        <MenuItem
          value={category._id}
          onClick={(e) => {
            e.stopPropagation();
            handleCategorySelect(category._id); // select parent category
            if (category.children?.length > 0) {
              handleToggle(category._id); // open and close children
            }
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>{category.title}</Typography>
            {category.children?.length > 0 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(category._id); // open and close children without select category
                }}
              >
                {openCategories[category._id] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>
        </MenuItem>

        {/* show nested categories (children) */}
        {category.children?.length > 0 && (
          <Collapse
            in={openCategories[category._id]}
            timeout="auto"
            unmountOnExit
          >
            {renderCategories(category.children, level + 1)}
          </Collapse>
        )}
      </div>
    ));
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{labelText}</InputLabel>
      <Select
        label={labelText}
        name="parent"
        value={formData.parent || ""}
        onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
        renderValue={(selected) => {
          let selectedCategory = categories.find(
            (category) => category._id === selected
          );

          if (!selectedCategory) {
            categories.forEach((category) => {
              const findCategory = (cat) => {
                if (cat._id === selected) return cat;
                if (cat.children) {
                  for (const child of cat.children) {
                    const result = findCategory(child);
                    if (result) return result;
                  }
                }
                return null;
              };
              const childCategory = findCategory(category);
              if (childCategory) {
                selectedCategory = childCategory;
              }
            });
          }

          return selectedCategory ? selectedCategory.title : "انتخاب کنید";
        }}
      >
        {isLoading ? (
          <MenuItem>در حال بارگذاری...</MenuItem>
        ) : error ? (
          <MenuItem>خطا در دریافت دسته‌ها</MenuItem>
        ) : (
          renderCategories(categories)
        )}
      </Select>
    </FormControl>
  );
};

export default CategorySelector;
