import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Demo from "@/pages/Demo";
import ProjectFiles from "@/pages/ProjectFiles";
import Documentation from "@/pages/Documentation";
import { Sidebar } from "@/components/Sidebar";

function Router() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:pl-64 transition-all duration-300">
        <div className="container max-w-7xl mx-auto p-4 md:p-8 pt-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/demo" component={Demo} />
            <Route path="/files" component={ProjectFiles} />
            <Route path="/docs" component={Documentation} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
