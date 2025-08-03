const defaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection time
  },
  mutations: {
    retry: 1,
  },
};

export default defaultOptions;
