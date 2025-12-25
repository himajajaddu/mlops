import { usePredictionStats, usePredictions } from "@/hooks/use-predictions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Users, AlertTriangle, TrendingUp, ArrowRight, Github } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = usePredictionStats();
  const { data: recent, isLoading: recentLoading } = usePredictions();

  // Mock data for the chart if stats aren't enough or empty
  const chartData = [
    { name: 'Low Risk', value: stats?.negative || 0 },
    { name: 'High Risk', value: stats?.positive || 0 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">MLOps Pipeline Overview & Metrics</p>
        </div>
        <div className="flex gap-3">
           <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Repository</span>
          </a>
          <Link href="/demo">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              <Activity className="w-4 h-4" />
              <span>Run Prediction</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Processed via API
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-destructive hover:-translate-y-1 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.positive}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Identified as potential heart disease
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-accent hover:-translate-y-1 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Validation set performance
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Breakdown of prediction outcomes</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4 }}
        >
          <Card className="h-[400px] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest API calls and results</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {recentLoading ? (
                  <div className="text-center py-10 text-muted-foreground">Loading...</div>
                ) : recent?.slice(0, 5).map((pred) => (
                  <div key={pred.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pred.prediction === 1 ? 'bg-destructive' : 'bg-green-500'}`} />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">Age: {pred.age}, BP: {pred.trestbps}</span>
                        <span className="text-xs text-muted-foreground">ID: #{pred.id}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${pred.prediction === 1 ? 'text-destructive' : 'text-green-600'}`}>
                        {pred.prediction === 1 ? 'High Risk' : 'Low Risk'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(pred.probability * 100).toFixed(1)}% Prob.
                      </div>
                    </div>
                  </div>
                ))}
                {(!recent || recent.length === 0) && (
                   <div className="text-center py-10 text-muted-foreground">No recent predictions found.</div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                 <Link href="/demo" className="text-sm text-primary hover:underline flex items-center gap-1">
                   Make new prediction <ArrowRight className="w-3 h-3" />
                 </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
