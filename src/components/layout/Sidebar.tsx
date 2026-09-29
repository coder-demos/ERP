import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Boxes,
  Flame,
  Layers3,
  FileText,
  Truck,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Factory,
  AlertTriangle
} from 'lucide-react';
import { useSteelERP } from '../../context/SteelERPContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'lowStock' | 'pendingOrders' | 'production';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Company / Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'products', label: 'Steel Products', icon: Layers },
  { id: 'inventory', label: 'SKU & Inventory', icon: Boxes, badgeKey: 'lowStock' },
  { id: 'production', label: 'Manufacturing / Production', icon: Flame, badgeKey: 'production' },
  { id: 'raw-materials', label: 'Raw Materials', icon: Layers3 },
  { id: 'orders', label: 'Orders / Sales', icon: FileText, badgeKey: 'pendingOrders' },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'reports', label: 'Reports', icon: BarChart2 }
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    products,
    rawMaterials,
    orders,
    productionRuns,
    companyProfile
  } = useSteelERP();

  const getBadgeCount = (key?: 'lowStock' | 'pendingOrders' | 'production') => {
    switch (key) {
      case 'lowStock': {
        const lowProds = products.filter((p) => p.currentStock <= p.minStockLevel).length;
        const lowRaw = rawMaterials.filter((rm) => rm.currentStock <= rm.minStockLevel).length;
        return lowProds + lowRaw;
      }
      case 'pendingOrders':
        return orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
      case 'production':
        return productionRuns.filter((pr) => pr.status === 'In Production' || pr.status === 'Planned').length;
      default:
        return 0;
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-all duration-200 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Factory className="h-5 w-5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold tracking-tight text-white truncate">
                ApexSteel ERP
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {companyProfile.facilityCode}
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Factory className="h-5 w-5" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${
            isSidebarCollapsed ? 'hidden' : 'flex'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeCount = item.badgeKey ? getBadgeCount(item.badgeKey) : 0;
          const isWarningBadge = item.badgeKey === 'lowStock' && badgeCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isSidebarCollapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {badgeCount > 0 && (
                    <span
                      className={`ml-auto font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded font-semibold ${
                        isWarningBadge
                          ? 'bg-amber-500 text-slate-950'
                          : isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapsed expand toggle button */}
      {isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <button
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Industrial Plant Info Footer */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/60">
        {!isSidebarCollapsed ? (
          <div className="space-y-1 text-[11px]">
            <p className="font-semibold text-slate-200 truncate">
              {companyProfile.companyName}
            </p>
            <p className="text-slate-400 font-mono text-[10px] truncate">
              Cap: {companyProfile.annualCapacityMT.toLocaleString()} MT / yr
            </p>
          </div>
        ) : (
          <div className="text-center text-[10px] font-mono text-slate-400">
            ERP
          </div>
        )}
      </div>
    </aside>
  );
};
