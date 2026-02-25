import React from 'react';
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import RoleSelector from './components/RoleSelector';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import AdminPortal from './components/AdminPortal';
import SupportButton from './components/SupportButton';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SupportButton />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Primary role selection route
const selectRoleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/select-role',
  component: RoleSelector,
});

// Alias for backward compatibility
const portalSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portal-selection',
  component: RoleSelector,
});

const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient',
  component: PatientPortal,
});

const doctorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor',
  component: DoctorPortal,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPortal,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  selectRoleRoute,
  portalSelectionRoute,
  patientRoute,
  doctorRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
