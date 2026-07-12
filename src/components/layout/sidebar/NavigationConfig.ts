import {
  Home,
  Database,
  FileCode2,
  Share2,
  GitBranch,
  Sparkles,
  Bot,
  AlertTriangle,
  CheckCircle,
  Activity,
  Workflow,
  Github,
  BookOpen,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

export const NAVIGATION_GROUPS = [
  {
    name: 'Overview',
    items: [
      { name: 'Home', href: '/', icon: Home },
    ],
  },
  {
    name: 'Catalog',
    items: [
      { name: 'Assets', href: '/assets', icon: Database },
      { name: 'Contracts', href: '/contracts', icon: FileCode2 },
      { name: 'Sources', href: '/sources', icon: Share2 },
      { name: 'Lineage', href: '/lineage', icon: GitBranch },
    ],
  },
  {
    name: 'AI',
    items: [
      { name: 'AI Studio', href: '/ai', icon: Sparkles },
      { name: 'Copilot', href: '/copilot', icon: Bot },
    ],
  },
  {
    name: 'Monitor',
    items: [
      { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
      { name: 'Validations', href: '/validations', icon: CheckCircle },
      { name: 'SLA', href: '/sla', icon: Activity },
    ],
  },
  {
    name: 'Operations',
    items: [
      { name: 'Airflow', href: '/airflow', icon: Workflow },
      { name: 'GitHub', href: '/github', icon: Github },
      { name: 'Runbooks', href: '/runbooks', icon: BookOpen },
    ],
  },
  {
    name: 'Executive',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
];

export const SETTINGS_NAVIGATION = [
  { name: 'Settings', href: '/settings', icon: Settings },
];
