import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CatalogProvider } from "@/context/CatalogContext";
import { UserPrefsProvider } from "@/context/UserPrefsContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AppLayout from "@/components/AppLayout";
import OnboardingModal from "@/components/OnboardingModal";
import HomePage from "@/pages/HomePage";
import VideoDetailPage from "@/pages/VideoDetailPage";
import PerformersPage from "@/pages/PerformersPage";
import PerformerProfilePage from "@/pages/PerformerProfilePage";
import TagsPage from "@/pages/TagsPage";
import TagDetailPage from "@/pages/TagDetailPage";
import CollectionsPage from "@/pages/CollectionsPage";
import CollectionDetailPage from "@/pages/CollectionDetailPage";
import SearchPage from "@/pages/SearchPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <UserPrefsProvider>
            <CatalogProvider>
              <OnboardingModal />
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/video/:id" element={<VideoDetailPage />} />
                  <Route path="/performers" element={<PerformersPage />} />
                  <Route path="/performer/:id" element={<PerformerProfilePage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/tag/:id" element={<TagDetailPage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collection/:id" element={<CollectionDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </CatalogProvider>
          </UserPrefsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
