import { NavItem } from 'src/app/view-formateur/layouts/full/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'dashboard-formateur',
    iconName: 'layout-dashboard',
    route: '/dashboard-formateur',
  },
  {
    navCap: 'Ui Components',
  },

  {
    displayName: 'Add cour',
  
    route: '/ui-components/ajout-cour',
  },
  {
    displayName: 'mes cours',
  
    route: '/ui-components/mes-cours',
  },
 

  {
    displayName: 'lists questions',
  
    route: '/ui-components/lists-questions',
  },
 




];
