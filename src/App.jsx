//imports for reactQuery
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import defaultOptions from "./configs/reactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./pages/Layout";
import { Container } from "@mui/material";

function App() {
  //create client to use reactQuery
  const queryClient = new QueryClient({
    defaultOptions,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Container
        maxWidth="100%"
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Layout>
          <Router />
        </Layout>
      </Container>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
