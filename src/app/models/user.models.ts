export class UserAuth {
    constructor() { }
    public Correo: string ="";
    public Password: string ="";
    public CveEstatus: string ="";
    public Detalle: string ="";
    public IdCliente: string ="";
    public isAuth: string ="";
    
  }

  export class UserData {
    constructor() { }
    public Nombre: string ="";
    public Paterno: string ="";
    public Materno: string ="";
    public CvePerfil: string ="";
    public TipoCliente: string ="";
    public RazonSocial: string ="";
    public ClavePatente: string ="";
    public NumCuentas: string ="";
    public Modulos: ModulosUser[]=[];
  }

  export class ModulosUser{
    constructor() { }
    public ClaveModulo: string ="";
    public Detalle: string ="";
  }

  export class UserFoto {
    constructor() { }
    public Content: string ="";
    public FileName: string ="";
  }