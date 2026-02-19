import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { EmergencySOS } from './components/EmergencySOS';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useIsCallerAdmin } from './hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <div className="relative h-[400px] overflow-hidden">
            <img
              src="/assets/generated/hospital-hero.dim_1920x600.png"
              alt="Hospital"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold tracking-tight mb-4">
                  Emergency Medical Services
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Fast, reliable emergency response system. Submit your emergency case and get immediate assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            {isAuthenticated && isAdmin && !adminLoading ? (
              <Tabs defaultValue="emergency" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="emergency">Emergency SOS</TabsTrigger>
                  <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
                </TabsList>

                <TabsContent value="emergency">
                  <EmergencySOS />
                </TabsContent>

                <TabsContent value="admin">
                  <AdminDashboard />
                </TabsContent>
              </Tabs>
            ) : (
              <EmergencySOS />
            )}
          </div>
        </main>
        <Footer />
        <Toaster />
        {showProfileSetup && <ProfileSetupModal />}
      </div>
    </ThemeProvider>
  );
}

export default App;
