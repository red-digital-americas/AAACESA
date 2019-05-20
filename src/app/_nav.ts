
var permisos = JSON.parse(localStorage.getItem("rol"));
var menu= [];

switch(permisos)
{
  case "MAESTRO":
    menu =[
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-home',
    },
    {
      name: 'Prealertas',
      url: '/prealertas',
      icon: 'icon-info'
    },
    {
      name: 'Previos',
      url: '/previos',
      icon: 'cui-task'
    },
    {
      name: 'Salidas',
      url: '/salidas',
      icon: 'icon-direction',
    },
    {
      name: 'Exportación',
      url: '/exportaciones',
      icon: 'icon-globe',
    },
    {
      name: 'Finanzas',
      url: '/finanzas',
      icon: 'icon-chart'
    },
    {
      name: 'Consulta de Mercancía',
      url: '/mercancias',
      icon: 'icon-basket-loaded'
    },
    {
      name: 'Abandono',
      url: '/abandono',
      icon: 'icon-grid',
    },
    {
      divider: true
    },
  ];
    break;
  case "ADMIN":
    menu =[
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-home',
    },
    {
      name: 'Consulta de Mercancía',
      url: '/mercancias',
      icon: 'icon-basket-loaded'
    },
    // {
    //   name: 'Pre Alertas',
    //   url: '/prealertas',
    //   icon: 'icon-info'
    // },
    // {
    //   name: 'Previos',
    //   url: '/previos',
    //   icon: 'cui-task'
    // },
    // {
    //   name: 'Salidas',
    //   url: '/salidas',
    //   icon: 'icon-direction',
    // },
    // {
    //   name: 'Finanzas',
    //   url: '/finanzas',
    //   icon: 'icon-chart'
    // },
    {
      divider: true
    },
  ];
    break;
  case "OPERACION":
    menu =[
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-home',
    },
    {
      name: 'Pre Alertas',
      url: '/prealertas',
      icon: 'icon-info'
    },
    {
      name: 'Previos',
      url: '/previos',
      icon: 'cui-task'
    },
    {
      name: 'Salidas',
      url: '/salidas',
      icon: 'icon-direction',
    },
    {
      name: 'Exportación',
      url: '/exportaciones',
      icon: 'icon-globe',
    },
    {
      name: 'Consulta de Mercancía',
      url: '/mercancias',
      icon: 'icon-basket-loaded'
    },
    {
      name: 'Abandono',
      url: '/abandono',
      icon: 'icon-grid',
    },
    {
      divider: true
    },
  ];
    break;
  case "FACTURACION":
  menu =[
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-home',
    },
    {
      name: 'Finanzas',
      url: '/finanzas',
      icon: 'icon-chart'
    },
    {
      divider: true
    },
  ];
    break;
}

export const navItems = menu;


