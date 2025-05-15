import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productsApi";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "../components/templates/homePage/ProductCard";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

//material ui direction setting for input
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const Shop = () => {
  const theme = useTheme();

  // State برای فیلترها و مرتب‌سازی
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [categoryPage, setCategoryPage] = useState({});

  // دریافت محصولات
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      console.log("Raw API Response:", response);
      console.log("Returning Data:", response.data);
      return response.data; // response.data شامل { statusCode: 200, data: { products: [...] } }
    },
  });

  // لاگ برای دیباگ
  console.log("Products Data (raw):", productsData);
  console.log("Products Data Inner:", productsData?.data);
  console.log("Products Data Products:", productsData?.data?.products);
  console.log("Products Error:", productsError);

  // استخراج دسته‌بندی‌ها از محصولات
  const categories = useMemo(() => {
    const products = Array.isArray(productsData?.data?.products)
      ? productsData.data.products
      : [];
    if (!products.length) return [];
    const uniqueCategories = [];
    const seenIds = new Set();

    products.forEach((product) => {
      const category = product.category;
      if (category && category.id && !seenIds.has(category.id)) {
        seenIds.add(category.id);
        uniqueCategories.push({
          id: category.id,
          name: category.title,
          slug: category.slug,
        });
      }
    });

    console.log("Extracted Categories:", uniqueCategories);
    return uniqueCategories;
  }, [productsData]);

  // گروه‌بندی محصولات بر اساس دسته‌بندی
  const groupedProducts = useMemo(() => {
    const products = Array.isArray(productsData?.data?.products)
      ? productsData.data.products
      : [];
    if (!products.length) {
      console.log("No products, returning empty array");
      return [];
    }

    // مرتب‌سازی محصولات
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);

      switch (sortBy) {
        case "priceAsc":
          return priceA - priceB;
        case "priceDesc":
          return priceB - priceA;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    // فیلتر کردن محصولات
    const filteredProducts = sortedProducts.filter((product) => {
      const matchesCategory =
        !filters.category || product.category.id === filters.category;
      const matchesSearch =
        !filters.search ||
        product.title.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    console.log("Filtered Products:", filteredProducts);

    // گروه‌بندی محصولات بر اساس دسته‌بندی
    const groups = categories
      .map((category) => {
        const categoryProducts = filteredProducts.filter(
          (product) => product.category.id === category.id
        );
        if (categoryProducts.length === 0) {
          console.log(`No products for category ${category.name}`);
          return null;
        }

        const page = categoryPage[category.id] || 1;
        const productsToShow = categoryProducts.slice(0, page * 4);

        return {
          category,
          products: productsToShow,
          hasMore: productsToShow.length < categoryProducts.length,
          totalProducts: categoryProducts.length,
        };
      })
      .filter((group) => group !== null);

    console.log("Grouped Products:", groups);
    return groups;
  }, [productsData, categories, filters, sortBy, categoryPage]);

  // پاک کردن فیلترها
  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
    });
    setCategoryPage({});
  };

  // لود محصولات بیشتر برای یه دسته‌بندی
  const loadMoreProducts = (categoryId) => {
    setCategoryPage((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 1) + 1,
    }));
  };

  // لاگ قبل از رندر
  console.log("Rendering groupedProducts:", groupedProducts);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* بخش اصلی محصولات */}
        <Grid item xs={12}>
          {/* هدر و فیلترها */}
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            mb={4}
            sx={{
              backgroundColor: "rgba(0,0,0,0.02)",
              padding: "16px",
              borderRadius: "12px",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <CacheProvider value={cacheRtl}>
                <div dir="rtl">
                  <TextField
                    label="جستجوی محصول"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    sx={{
                      marginRight: "10px",
                      width: { xs: "100%", sm: 250 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "white",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
                    <InputLabel>دسته‌بندی</InputLabel>
                    <Select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      label="دسته‌بندی"
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "white",
                      }}
                    >
                      <MenuItem value="">همه</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </CacheProvider>
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                پاک کردن
              </Button>
            </Box>
            <CacheProvider value={cacheRtl}>
              <div dir="rtl">
                <FormControl sx={{ width: { xs: "100%", sm: 150 } }}>
                  <InputLabel>مرتب‌سازی</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="مرتب‌سازی"
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "white",
                    }}
                    startAdornment={
                      <InputAdornment position="end">
                        <SortIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="newest">جدیدترین</MenuItem>
                    <MenuItem value="priceAsc">قیمت: کم به زیاد</MenuItem>
                    <MenuItem value="priceDesc">قیمت: زیاد به کم</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </CacheProvider>
          </Box>

          {/* نمایش فیلترهای فعال */}
          <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
            {filters.category && (
              <Chip
                label={`دسته‌بندی: ${
                  categories.find((c) => c.id === filters.category)?.name
                }`}
                onDelete={() => setFilters({ ...filters, category: "" })}
                sx={{
                  backgroundColor: "rgba(255,107,0,0.1)",
                  color: "#FF6B00",
                  "& .MuiChip-deleteIcon": {
                    color: "#FF6B00",
                  },
                }}
              />
            )}
            {filters.search && (
              <Chip
                label={`جستجو: ${filters.search}`}
                onDelete={() => setFilters({ ...filters, search: "" })}
                sx={{
                  backgroundColor: "rgba(255,107,0,0.1)",
                  color: "#FF6B00",
                  "& .MuiChip-deleteIcon": {
                    color: "#FF6B00",
                  },
                }}
              />
            )}
          </Box>

          {/* نمایش محصولات گروه‌بندی‌شده */}
          {isLoadingProducts ? (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress sx={{ color: "#FF6B00" }} />
            </Box>
          ) : groupedProducts.length > 0 ? (
            <Box>
              {groupedProducts.map((group) => (
                <Box key={group.category.id} mb={6}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography variant="h5" fontWeight={600}>
                      {group.category.name}
                    </Typography>
                    <Link
                      to={`/category/${
                        group.category.slug || group.category.id
                      }`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#FF6B00",
                          color: "#FF6B00",
                          "&:hover": {
                            borderColor: "#E55F00",
                            backgroundColor: "rgba(255,107,0,0.04)",
                          },
                        }}
                      >
                        مشاهده همه محصولات دسته ({group.category.name})
                      </Button>
                    </Link>
                  </Box>
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      overflowX: "hidden",
                      width: "100%",
                      margin: 0,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {group.products.map((product) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={product.id}
                        sx={{
                          padding: "12px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <ProductCard product={product} isAdmin={false} />
                      </Grid>
                    ))}
                  </Grid>
                  {group.hasMore && (
                    <Box display="flex" justifyContent="center" my={4}>
                      <Button
                        variant="contained"
                        onClick={() => loadMoreProducts(group.category.id)}
                        sx={{
                          backgroundColor: "#FF6B00",
                          "&:hover": {
                            backgroundColor: "#E55F00",
                          },
                        }}
                      >
                        بارگذاری بیشتر
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={8}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                محصولی یافت نشد
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                لطفاً فیلترهای جستجو را تغییر دهید
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Shop;
