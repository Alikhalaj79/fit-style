//imports for reactQuery
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Router from "./router/Router"

function App() {
  //create client to user reactQuery
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App
