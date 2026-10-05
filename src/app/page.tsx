"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Users, ShoppingBag, DollarSign, Package, Search, Bell, ChevronDown, Moon, Sun, Download, 
  RefreshCw, Plus, X, Calendar, Check, Activity, Clock, ArrowUpRight, FileText, ChevronRight, 
  Trash2, TrendingUp, TrendingDown, Star, MessageSquare, ShieldAlert
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Mock Initial Orders Data
const INITIAL_ORDERS = [
  { id: "ORD-9872", customer: "Alice Johnson", product: "Data OS Enterprise", date: "2026-08-02", status: "Paid", amount: 1250 },
  { id: "ORD-9871", customer: "Bob Smith", product: "SLA Observability Add-on", date: "2026-08-02", status: "Pending", amount: 350 },
  { id: "ORD-9870", customer: "Charlie Brown", product: "AI Studio Seat", date: "2026-08-01", status: "Paid", amount: 150 },
  { id: "ORD-9869", customer: "Diana Prince", product: "Stripe Connector Premium", date: "2026-07-28", status: "Failed", amount: 500 },
  { id: "ORD-9868", customer: "Ethan Hunt", product: "Governance Package", date: "2026-07-25", status: "Paid", amount: 4800 },
  { id: "ORD-9867", customer: "Fiona Gallagher", product: "Data Quality Engine v2", date: "2026-07-20", status: "Pending", amount: 1200 },
  { id: "ORD-9866", customer: "George Clark", product: "Lineage Tracker Tool", date: "2026-07-15", status: "Paid", amount: 850 }
];

// Mock Chart Data for Revenue & Orders
const REVENUE_DATA = [
  { name: "Jul 27", revenue: 32000, orders: 120 },
  { name: "Jul 28", revenue: 38000, orders: 145 },
  { name: "Jul 29", revenue: 35000, orders: 130 },
  { name: "Jul 30", revenue: 42000, orders: 168 },
  { name: "Jul 31", revenue: 45000, orders: 190 },
  { name: "Aug 01", revenue: 47000, orders: 210 },
  { name: "Aug 02", revenue: 48250, orders: 225 }
];

// Mock Activities
const INITIAL_ACTIVITIES = [
  { id: 1, type: "user", user: "Alice Johnson", action: "upgraded to Enterprise Plan", time: "5 mins ago" },
  { id: 2, type: "system", user: "System Monitor", action: "successfully completed billing sync", time: "25 mins ago" },
  { id: 3, type: "order", user: "Bob Smith", action: "placed order for SLA Add-on", time: "1 hour ago" },
  { id: 4, type: "incident", user: "Quality Guard", action: "flagged stripe.fct_payments rule alert", time: "2 hours ago" },
  { id: 5, type: "system", user: "Billing Engine", action: "processed monthly invoices", time: "5 hours ago" }
];

// Custom Animated Counter using requestAnimationFrame
function AnimatedCounter({ value, duration = 1500, isCurrency = false }: { value: number; duration?: number; isCurrency?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {isCurrency ? "$" : ""}
      {count.toLocaleString()}
    </span>
  );
}

export default function WorkspaceHome() {
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAppStore();

  // Dynamically set background and force theme on parent <main> for Home Page
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) {
      const originalBg = mainEl.style.background;
      const originalTheme = mainEl.getAttribute("data-theme");

      if (theme === "light") {
        mainEl.style.background = "#F8FAFC";
        mainEl.setAttribute("data-theme", "light");
      } else {
        mainEl.style.background = "radial-gradient(circle at 50% 0%, #13132B 0%, #030308 60%, #000000 100%)";
        mainEl.setAttribute("data-theme", "dark");
      }

      return () => {
        mainEl.style.background = originalBg;
        if (originalTheme) {
          mainEl.setAttribute("data-theme", originalTheme);
        } else {
          mainEl.removeAttribute("data-theme");
        }
      };
    }
  }, [theme]);
  
  // Dashboard state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoadingSimulated, setIsLoadingSimulated] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"revenue" | "orders">("revenue");
  
  // Toast notifications
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "error" }[]>([]);
  
  // Simulated Interactive States
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [stats, setStats] = useState({
    users: 10482,
    orders: 3249,
    revenue: 48250,
    products: 1842
  });
  
  // Sort States
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Date Filter logic helper
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchTerm.trim() !== "") {
      result = result.filter(o => 
        o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    const now = new Date();
    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(o => new Date(o.date) >= sevenDaysAgo);
    } else if (dateFilter === "30days") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(o => new Date(o.date) >= thirtyDaysAgo);
    } else if (dateFilter === "today") {
      const todayStr = now.toISOString().split('T')[0];
      result = result.filter(o => o.date === "2026-08-02"); // Match demo dataset today date
    }

    // Sort order logic
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [orders, searchTerm, dateFilter, sortConfig]);

  // Request sort column
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    showToast(`Sorted table by ${key} (${direction})`, "info");
  };

  // Toast notifier helper
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Simulated Live Stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random increase in revenue, users, orders
      setStats(prev => {
        const revInc = Math.floor(Math.random() * 150) + 50;
        const userInc = Math.random() > 0.6 ? 1 : 0;
        const ordInc = Math.random() > 0.5 ? 1 : 0;

        if (ordInc > 0 && Math.random() > 0.7) {
          // Add a dynamic order occasionally
          const randomCustomers = ["Sophia Loren", "Marcus Aurelius", "John Wick", "Jane Eyre"];
          const randomProducts = ["API Studio Seat", "Data OS Enterprise", "SLA Observability Add-on"];
          const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 1000) + 9000}`,
            customer: randomCustomers[Math.floor(Math.random() * randomCustomers.length)],
            product: randomProducts[Math.floor(Math.random() * randomProducts.length)],
            date: new Date().toISOString().split('T')[0],
            status: "Paid",
            amount: Math.floor(Math.random() * 400) + 100
          };
          setOrders(o => [newOrder, ...o]);
          
          // Add dynamic activity
          setActivities(act => [
            { id: Date.now(), type: "order", user: newOrder.customer, action: `placed order for ${newOrder.product}`, time: "Just now" },
            ...act.slice(0, 4)
          ]);

          showToast(`New Live Order received: ${newOrder.customer}`, "success");
        }

        return {
          users: prev.users + userInc,
          orders: prev.orders + ordInc,
          revenue: prev.revenue + revInc,
          products: prev.products
        };
      });
    }, 12000); // Trigger check every 12s

    return () => clearInterval(interval);
  }, []);

  // Quick Action: Add new order
  const handleAddNewOrder = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000) + 9000}`,
      customer: "Eleanor Vance",
      product: "AI Studio seat",
      date: new Date().toISOString().split('T')[0],
      status: "Paid",
      amount: 250
    };
    setOrders(prev => [newOrder, ...prev]);
    setStats(prev => ({ ...prev, orders: prev.orders + 1, revenue: prev.revenue + 250 }));
    setActivities(act => [
      { id: Date.now(), type: "order", user: newOrder.customer, action: `purchased ${newOrder.product}`, time: "Just now" },
      ...act.slice(0, 4)
    ]);
    showToast("Added order ORD-" + newOrder.id.split('-')[1] + " successfully", "success");
  };

  // Simulate Export Functionality
  const handleExportData = (format: "pdf" | "excel") => {
    setIsExportOpen(false);
    showToast(`Generating ${format.toUpperCase()} report...`, "info");
    setTimeout(() => {
      showToast(`Successfully downloaded dashboard_report.${format}`, "success");
    }, 2000);
  };

  // Simulate Loader toggle
  const handleSimulateLoad = () => {
    setIsLoadingSimulated(true);
    setTimeout(() => {
      setIsLoadingSimulated(false);
      showToast("Data refreshed successfully", "success");
    }, 1500);
  };

  // Calendar logic helpers
  const today = new Date();
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  return (
    <div className="space-y-6 pb-16 max-w-[1600px] mx-auto px-4 relative text-foreground">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl shadow-lg border text-sm flex items-center gap-3 backdrop-blur-md pointer-events-auto bg-card/95 
                ${toast.type === "success" ? "border-emerald-500/30 text-emerald-500" : ""}
                ${toast.type === "info" ? "border-blue-500/30 text-blue-500" : ""}
                ${toast.type === "error" ? "border-red-500/30 text-red-500" : ""}
              `}
            >
              <div className={`w-2 h-2 rounded-full 
                ${toast.type === "success" ? "bg-emerald-500" : ""}
                ${toast.type === "info" ? "bg-blue-500" : ""}
                ${toast.type === "error" ? "bg-red-500" : ""}
              `} />
              <span className="font-medium text-foreground">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative backdrop gradients for dark mode */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-blue-400/8 dark:bg-blue-400/12 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-5 w-[400px] h-[400px] bg-teal-400/6 dark:bg-teal-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-purple-500/6 dark:bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/40 pb-4">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">
            <span className="px-2.5 py-1 rounded-md bg-black text-white dark:bg-black dark:text-white font-extrabold border border-zinc-800 dark:border-zinc-700 shadow-md">Home</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="text-zinc-800 dark:text-zinc-100 font-semibold">Dashboard</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 dark:from-blue-300 dark:via-indigo-200 dark:to-purple-300 bg-clip-text text-transparent">SaaS Workspace Summary</h1>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-450 dark:hover:border-zinc-500 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-all w-full sm:w-56"
            />
          </div>

          {/* Simulate Refresh Load Button */}
          <button 
            onClick={handleSimulateLoad}
            className="p-2 bg-white dark:bg-zinc-900 hover:bg-zinc-55 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-450 dark:hover:border-zinc-500 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all cursor-pointer animate-in fade-in"
            title="Refresh dashboard stats"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSimulated ? "animate-spin" : ""}`} />
          </button>

          {/* Theme Mode Toggle */}
          <button 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 bg-white dark:bg-zinc-900 hover:bg-zinc-55 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-450 dark:hover:border-zinc-500 text-zinc-650 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all cursor-pointer"
            title="Toggle color theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 bg-white dark:bg-zinc-900 hover:bg-zinc-55 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-450 dark:hover:border-zinc-500 text-zinc-650 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>
            
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-3 z-50 outline-none animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800/50 mb-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-white">Platform Alerts</span>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X className="w-3 h-3" /></button>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer text-xs">
                      <p className="font-semibold text-emerald-550 dark:text-emerald-500">Live order processed</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Admin added standard SLA package order.</p>
                    </div>
                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer text-xs">
                      <p className="font-semibold text-amber-550 dark:text-amber-500">Revenue target at 85%</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Almost hit target metric for August 2026.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 bg-white dark:bg-zinc-900 hover:bg-zinc-55 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm">
                DP
              </div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 hidden sm:inline-block pr-1">
                {currentUser?.full_name?.split(" ")[0] || "Admin"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-50 outline-none flex flex-col gap-0.5"
                >
                  <div className="px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-800/50 text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">My Workspace</div>
                  <button className="w-full text-left px-3 py-1.5 text-xs text-zinc-850 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-2 group">
                    <Activity className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200" /> Account Status
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-xs text-zinc-850 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-2 group">
                    <FileText className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200" /> System Reports
                  </button>
                  <div className="h-px bg-zinc-200 dark:bg-zinc-800/50 my-1"></div>
                  <button onClick={() => { setIsProfileOpen(false); showToast("Simulated User Logged Out", "info"); }} className="w-full text-left px-3 py-1.5 text-xs text-rose-550 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-505/10 transition-colors">
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Welcome Banner with Black Highlighted Text */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative overflow-hidden rounded-2xl border-2 border-black/80 dark:border-zinc-700 bg-black text-white p-6 sm:p-8 shadow-2xl shadow-black/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-white text-xs font-bold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Highlighted Notice
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-inner">
            <p className="text-sm sm:text-base text-white leading-relaxed font-semibold">
              All services are up and active. We detected standard billing operations running. Review your live stats, check recent activities, and export your billing logs below.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Summary Metric Cards */}
      <AnimatePresence mode="wait">
        {isLoadingSimulated ? (
          <div key="skeleton-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm min-h-[110px] animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-24 h-4 bg-muted rounded"></div>
                  <div className="w-8 h-8 bg-muted rounded-xl"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded mb-2"></div>
                <div className="w-28 h-3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            key="actual-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Total Users */}
            <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-blue-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-blue-500/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Total Users</span>
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Users className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">
                <AnimatedCounter value={stats.users} />
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mt-3 relative z-10">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5%</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">from last month</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-teal-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-teal-500/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Total Orders</span>
                <div className="p-2 bg-teal-500/10 text-teal-500 rounded-xl"><ShoppingBag className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">
                <AnimatedCounter value={stats.orders} />
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mt-3 relative z-10">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.2%</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">from yesterday</span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-emerald-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-emerald-500/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Revenue</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><DollarSign className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">
                <AnimatedCounter value={stats.revenue} isCurrency={true} />
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mt-3 relative z-10">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+22.1%</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">from last month</span>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-amber-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-amber-500/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Products</span>
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Package className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">
                <AnimatedCounter value={stats.products} />
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mt-3 relative z-10">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.3%</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">from last week</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Advanced Chart Card */}
        <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-indigo-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg lg:col-span-2 space-y-4 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">SaaS Metrics Analysis</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">Historical charts demonstrating product revenue and order flow trends.</p>
            </div>
            
            {/* Chart Tab Selectors */}
            <div className="flex bg-zinc-105 dark:bg-zinc-950 p-1 rounded-xl w-fit border border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={() => setActiveTab("revenue")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "revenue" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              >
                Revenue (Line)
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "orders" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-555 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              >
                Orders (Bar)
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "revenue" ? (
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/40" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-foreground)' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#primaryGlow)" />
                </AreaChart>
              ) : (
                <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/40" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-foreground)' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="orders" name="Orders Processed" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar Widget Card */}
        <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-purple-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-800/80 mb-3">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" /> Calendar View
              </h2>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">August 2026</span>
            </div>
            
            {/* Mini Month Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-500 dark:text-zinc-300 mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Empty spaces for grid offset (August 2026 starts on Saturday) */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1 text-transparent">0</div>
              ))}
              
              {currentMonthDays.map(day => {
                const isSelected = selectedDay === day;
                const isToday = day === today.getDate() && today.getMonth() === 7 && today.getFullYear() === 2026;
                return (
                  <button 
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      showToast(`Selected August ${day}, 2026`, "info");
                    }}
                    className={`p-1.5 rounded-lg font-semibold transition-all cursor-pointer 
                      ${isSelected ? "bg-purple-600 text-white shadow-md shadow-purple-900/40 hover:bg-purple-500" : "hover:bg-zinc-105 dark:hover:bg-zinc-800 text-zinc-900 dark:hover:text-white"}
                      ${isToday && !isSelected ? "border border-purple-500 text-purple-500 dark:text-purple-400 font-bold" : ""}
                      ${!isSelected && !isToday ? "text-zinc-700 dark:text-zinc-300" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-300">
            <span className="font-semibold text-zinc-900 dark:text-white">Schedules:</span> 2 recurring invoicing cycles active today.
          </div>
        </div>
      </div>

      {/* Lower Row Grid: Quick Actions, Recent Activity, Latest Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latest Orders Table Section */}
        <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-cyan-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg lg:col-span-2 space-y-4 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Latest Orders</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">Detailed logs of customer subscription purchases.</p>
            </div>

            {/* Export and Filters controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date Filter selector */}
              <select 
                value={dateFilter}
                onChange={e => {
                  setDateFilter(e.target.value);
                  showToast(`Filtered orders by date: ${e.target.value}`, "info");
                }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-xs font-semibold px-3 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer text-zinc-800 dark:text-zinc-100"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>

              {/* Export Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-55 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-zinc-800 dark:text-zinc-100"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" /> Export <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
                </button>
                
                <AnimatePresence>
                  {isExportOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-50 outline-none flex flex-col gap-0.5"
                    >
                      <button onClick={() => handleExportData("pdf")} className="w-full text-left px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white transition-colors">PDF Report</button>
                      <button onClick={() => handleExportData("excel")} className="w-full text-left px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white transition-colors">Excel Sheet</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-700/60 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-55 dark:bg-zinc-950/30 border-b border-zinc-200 dark:border-zinc-700/60 text-xs font-bold text-zinc-700 dark:text-zinc-200">
                  <th className="p-3">Order ID</th>
                  <th className="p-3 cursor-pointer hover:text-zinc-950 dark:hover:text-foreground transition-colors" onClick={() => requestSort("customer")}>Customer</th>
                  <th className="p-3">Product</th>
                  <th className="p-3 cursor-pointer hover:text-zinc-950 dark:hover:text-foreground transition-colors" onClick={() => requestSort("date")}>Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 cursor-pointer hover:text-zinc-950 dark:hover:text-foreground transition-colors" onClick={() => requestSort("amount")}>Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs text-zinc-800 dark:text-foreground divide-y divide-zinc-250 dark:divide-border/30">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500 dark:text-muted-foreground">No orders matching conditions found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order.id} 
                        className="hover:bg-zinc-55 dark:hover:bg-zinc-800/30 transition-all group"
                      >
                        <td className="p-3 font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors">{order.id}</td>
                        <td className="p-3 font-bold text-zinc-900 dark:text-white">{order.customer}</td>
                        <td className="p-3 text-zinc-700 dark:text-zinc-300 font-medium">{order.product}</td>
                        <td className="p-3 font-medium text-zinc-700 dark:text-zinc-300">{order.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border 
                            ${order.status === "Paid" ? "bg-emerald-500/10 text-emerald-650 dark:text-emerald-500 border-emerald-500/20" : ""}
                            ${order.status === "Pending" ? "bg-amber-500/10 text-amber-650 dark:text-amber-500 border-amber-500/20" : ""}
                            ${order.status === "Failed" ? "bg-rose-500/10 text-rose-650 dark:text-rose-500 border-rose-500/20" : ""}
                          `}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-zinc-900 dark:text-white">${order.amount}</td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Recent Activity Side Panel */}
        <div className="space-y-6">
          
          {/* Quick Actions Section */}
          <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-pink-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg space-y-4 transition-all duration-300">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Quick Action Controls</h2>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleAddNewOrder}
                className="p-3 bg-gradient-to-tr from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white font-semibold rounded-xl text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 hover:shadow-lg cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Order</span>
              </button>
              <button 
                onClick={() => {
                  setStats(prev => ({ ...prev, users: prev.users + 1 }));
                  showToast("New platform user registered", "success");
                }}
                className="p-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 font-bold rounded-xl text-xs text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] shadow-sm"
              >
                <Users className="w-4 h-4 text-teal-555 dark:text-teal-500" />
                <span>Add User</span>
              </button>
            </div>

            {/* Progress Bars Indicators */}
            <div className="space-y-3.5 pt-2 border-t border-zinc-200 dark:border-zinc-850">
              {/* SLA Target */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-650 dark:text-zinc-300">Monthly Sales Target</span>
                  <span className="text-zinc-900 dark:text-white font-bold">85%</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              {/* Active Users SLA */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-650 dark:text-zinc-300">SLA System Freshness</span>
                  <span className="text-zinc-900 dark:text-white font-bold">98.4%</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98.4%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-rose-500 border-x border-b border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg space-y-4 transition-all duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-850">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> Recent Actions
              </h2>
            </div>
            
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-700/50">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs relative pl-1.5 text-zinc-900 dark:text-white">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-zinc-950 flex-shrink-0 z-10 mt-0.5
                    ${act.type === "user" ? "border-primary" : ""}
                    ${act.type === "system" ? "border-teal-500" : ""}
                    ${act.type === "order" ? "border-emerald-500" : ""}
                    ${act.type === "incident" ? "border-rose-500" : ""}
                  `} />
                  <div className="flex-1">
                    <p className="text-zinc-900 dark:text-white font-semibold">
                      {act.user} <span className="text-zinc-650 dark:text-zinc-300 font-normal">{act.action}</span>
                    </p>
                    <span className="text-[10px] text-zinc-550 dark:text-zinc-400 font-semibold mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
