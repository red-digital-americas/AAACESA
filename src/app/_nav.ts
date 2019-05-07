
var permisos = JSON.parse(localStorage.getItem("rol"));
var menu= [];

switch(permisos)
{
  case "ADMIN":
    menu =[
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-home',
    },
    {
      name: 'Mercancía',
      url: '/mercancias',
      icon: 'icon-basket-loaded'
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
      url: '/buttons/buttons',
      icon: 'icon-globe',
    },
    {
      name: 'Finanzas',
      url: '/charts',
      icon: 'icon-chart'
    },
    {
      name: 'Cálculo Maniobras',
      url: '/calculadora',
      icon: 'cui-calculator',
    },
    // {
    //   name: 'Bitácoras',
    //   url: '/forms/basic-forms',
    //   icon: 'icon-note',
    // },
    // {
    //   name: 'Admin de usuarios',
    //   url: '/adminuser',
    //   icon: 'fa fa-sitemap',
    // },
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
  case "MAESTRO":
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
      name: 'Finanzas',
      url: '/charts',
      icon: 'icon-chart'
    },
    // {
    //   name: 'Bitácoras',
    //   url: '/forms/basic-forms',
    //   icon: 'icon-note',
    // },
    // {
    //   name: 'Admin de usuarios',
    //   url: '/adminuser',
    //   icon: 'fa fa-sitemap',
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
      url: '/charts',
      icon: 'icon-chart'
    },
    {
      divider: true
    },
  ];
    break;
}

export const navItems = menu;


