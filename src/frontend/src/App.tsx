import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleSelector } from './components/RoleSelector';
import { PatientPortal } from './components/PatientPortal';
import { DoctorPortal } from './components/DoctorPortal';
import { AdminPortal } from './components/AdminPortal';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { SupportButton } from './components/SupportButton';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { identity } = useInternetIdentity();
  const [currentRole, setCurrentRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleRoleSelect = (role: 'patient' | 'doctor' | 'admin') => {
    setCurrentRole(role);
  };

  const handleBackToHome = () => {
    setCurrentRole(null);
  };

  const renderPortal = () => {
    switch (currentRole) {
      case 'patient':
        return <PatientPortal />;
      case 'doctor':
        return <DoctorPortal />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <RoleSelector onSelectRole={handleRoleSelect} isAuthenticated={isAuthenticated} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentRole={currentRole} onBackToHome={currentRole ? handleBackToHome : undefined} />
      <main className="flex-1">
        {renderPortal()}
      </main>
      <Footer />
      <ProfileSetupModal open={showProfileSetup} />
      <SupportButton />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
