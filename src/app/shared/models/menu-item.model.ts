export interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon: string; // Lucide icon name
  badge?: string;
  position: 'main' | 'bottom';
  children?: MenuItem[];
}