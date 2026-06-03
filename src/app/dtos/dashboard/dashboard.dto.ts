export interface AdminStatsDto {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentUsers: RecentUserDto[];
  recentOrders: RecentOrderDto[];
  salesByDay?: DailySalesDto[];
}

export interface UserStatsDto {
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  reviewCount: number;
}

export interface WidgetStatsDto {
  views: number;
  sales: number;
  conversion: number;
  growth: number;
}

export interface RecentUserDto {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}

export interface RecentOrderDto {
  id: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface DailySalesDto {
  date: string;
  sales: number;
  orders: number;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}
