// useNavbarConfig.js
import { useMemo } from 'react';
import navbarConfig from '../config/navbar.config.json';

export const useNavbarConfig = (userRole = 'anon', isLogged = false) => {
  const config = useMemo(() => {
    const role = isLogged ? userRole : 'anon';
    
    // Filter menu items based on user role
    const filteredMenuItems = navbarConfig.navbar.menuItems
      .filter(item => item.visible && item.roles.includes(role))
      .sort((a, b) => a.order - b.order);

    // Get appropriate auth button
    const authButton = isLogged 
      ? navbarConfig.navbar.authButtons.logout
      : navbarConfig.navbar.authButtons.login;

    // Check if auth button is available for current role
    const showAuthButton = authButton.roles.includes(role);

    return {
      brand: navbarConfig.navbar.brand,
      menuItems: filteredMenuItems,
      authButton: showAuthButton ? authButton : null,
      settings: navbarConfig.navbar.settings,
      rolePermissions: navbarConfig.navbar.rolePermissions[role]
    };
  }, [userRole, isLogged]);

  // Helper functions
  const canAccess = (pageType) => {
    const permissions = config.rolePermissions;
    switch (pageType) {
      case 'public':
        return permissions.canAccessPublicPages;
      case 'user':
        return permissions.canAccessUserPages;
      case 'admin':
        return permissions.canAccessAdminPages;
      default:
        return false;
    }
  };

  const getMenuItemById = (id) => {
    return config.menuItems.find(item => item.id === id);
  };

  const isMenuItemVisible = (id) => {
    const item = getMenuItemById(id);
    return item ? item.visible : false;
  };

  return {
    config,
    canAccess,
    getMenuItemById,
    isMenuItemVisible,
    // Quick access properties
    brand: config.brand,
    menuItems: config.menuItems,
    authButton: config.authButton,
    settings: config.settings
  };
};