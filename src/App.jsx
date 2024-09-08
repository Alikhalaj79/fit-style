//imports for reactQuery
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Router from "./router/Router"
import defaultOptions from "./configs/reactQuery";

function App() {
  //create client to use reactQuery
  const queryClient = new QueryClient({defaultOptions});
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App
