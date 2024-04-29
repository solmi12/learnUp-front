import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    navCap: 'Ui Components',
  },

  {
    displayName: 'List-Formateur',
    iconName: 'list',
    route: '/ui-components/chips',
  },
  {
    displayName: 'List-Users',
    iconName: 'list',
    route: '/ui-components/lists',
  },
  {
    displayName: 'pending-cour',
    iconName: 'list',
    route: '/ui-components/pending-cour',
  },

  
  {
    displayName: 'Ajout User',
  
    iconName: 'list',
    route: '/ui-components/nouveau-user',
  },

  {
    displayName: 'cours',
    iconName: 'list',
    route: '/ui-components/cours',
  },

  {
    displayName: 'Payments',
    iconName: 'list',
    route: '/ui-components/PaymentCour',
  },


];
