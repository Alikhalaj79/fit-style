import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, useCallback } from "react";
import { getProducts } from "../../../services/productsApi";
import { getCategories, deleteMultipleProducts } from "../../../services/admin";
import ProductCard from "./ProductCard";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Pagination,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { getUserProfile } from "../../../services/users";
import {
  Search,
  FilterList,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh,
} from "@mui/icons-material";

const ProductsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,
  });

  // Fetch categories separately
  const { data: categoriesData } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });

  const isAdmin = profileData?.data?.data?.user.role === "admin";

  // Filter and search products
  const filteredProducts = useMemo(() => {
    if (!data?.data?.data?.products) return [];

    let products = data.data.data.products;

    // Filter by search term
    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter(
        (product) => product.category?.slug === selectedCategory
      );
    }

    return products;
  }, [data, searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Get categories from the dedicated API
  const categories = useMemo(() => {
    if (!categoriesData?.data?.data?.categories) return [];

    // Flatten all categories including nested ones
    const flattenCategories = (cats) => {
      let result = [];
      cats.forEach((cat) => {
        result.push({
          id: cat._id,
          name: cat.title,
          slug: cat.slug,
        });
        if (cat.children && cat.children.length > 0) {
          result = result.concat(flattenCategories(cat.children));
        }
      });
      return result;
    };

    return flattenCategories(categoriesData.data.data.categories);
  }, [categoriesData]);

  const handleSelectProduct = useCallback((productId) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.includes(productId);
      if (isSelected) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const queryClient = useQueryClient();

  const { mutate: bulkDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteMultipleProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
      setSelectedProducts([]); // Clear selection after successful delete
      setSnackbar({
        open: true,
        message: "محصولات با موفقیت حذف شدند",
        severity: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting products:", error);
      setSnackbar({
        open: true,
        message: "خطا در حذف محصولات",
        severity: "error",
      });
    },
  });

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    if (selectedProducts.length > 0) {
      bulkDelete(selectedProducts);
      setShowDeleteConfirm(false);
    }
  };

  const cancelBulkDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    setSelectedProducts([]); // Clear selection when changing page
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to first page
    setSelectedProducts([]); // Clear selection
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.
        </Alert>
        <Button
          variant="contained"
          onClick={() => refetch()}
          startIcon={<Refresh />}
        >
          تلاش مجدد
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 4 },
        pr: { xs: 1.5, md: 0 }, // remove right padding on desktop (RTL)
        pl: { xs: 1.5, md: 4 }, // add left padding on desktop (LTR)
        maxWidth: "100vw",
        boxSizing: "border-box",
        minHeight: "100vh",
        transition: "all 0.3s",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          مدیریت محصولات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {filteredProducts.length} محصول از{" "}
          {data?.data?.data?.products?.length || 0} محصول
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>دسته‌بندی</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="دسته‌بندی"
              >
                <MenuItem value="all">همه دسته‌ها</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.slug}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>تعداد در صفحه</InputLabel>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                label="تعداد در صفحه"
              >
                <MenuItem value={8}>8 محصول</MenuItem>
                <MenuItem value={12}>12 محصول</MenuItem>
                <MenuItem value={16}>16 محصول</MenuItem>
                <MenuItem value={24}>24 محصول</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {isAdmin && selectedProducts.length > 0 && (
                <Tooltip title="حذف انتخاب شده">
                  <IconButton onClick={handleBulkDelete} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {isAdmin && selectedProducts.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "primary.light" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="white">
              {selectedProducts.length} محصول انتخاب شده
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={handleSelectAll}
            >
              {selectedProducts.length === paginatedProducts.length
                ? "لغو انتخاب همه"
                : "انتخاب همه"}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "در حال حذف..." : "حذف انتخاب شده"}
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Products Grid/List */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(pageSize)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={32} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : filteredProducts.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            محصولی یافت نشد
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || selectedCategory !== "all"
              ? "لطفاً فیلترهای جستجو را تغییر دهید"
              : "هنوز محصولی اضافه نشده است"}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid
            container
            spacing={3}
            sx={{
              mt: 0,
              width: "100%",
              margin: 0,
              boxSizing: "border-box",
              justifyContent: { xs: "center", md: "flex-start" },
              pr: 0,
              pl: 0,
            }}
          >
            {paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={product.id}>
                <ProductCard
                  product={product}
                  isAdmin={isAdmin}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={() => handleSelectProduct(product.id)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    صفحه {currentPage} از {totalPages}
                  </Typography>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2" color="text.secondary">
                    نمایش {startIndex + 1}-
                    {Math.min(endIndex, filteredProducts.length)} از{" "}
                    {filteredProducts.length} محصول
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={cancelBulkDelete}>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا مطمئن هستید که می‌خواهید {selectedProducts.length} محصول انتخاب
            شده را حذف کنید؟ این عملیات قابل بازگشت نیست.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: 2 }}>
          <Button onClick={cancelBulkDelete} color="primary" variant="outlined">
            لغو
          </Button>
          <Button
            onClick={confirmBulkDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsView;
