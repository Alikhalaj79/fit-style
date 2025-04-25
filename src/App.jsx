//imports for reactQuery
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Router from "./router/Router"
import defaultOptions from "./configs/reactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./pages/Layout";

function App() {
  //create client to use reactQuery
  const queryClient = new QueryClient({defaultOptions});
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
      <Router />
      </Layout>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App
