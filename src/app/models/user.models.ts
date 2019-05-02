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
    public ClavePatente: string ="";
    public TipoCliente: string ="";
    public RazonSocial: string ="";
    public RFC: string ="";
    public NumCuentas: string ="";
    public Correo: string ="";
    public Nombre: string ="";
    public Paterno: string ="";
    public Materno: string ="";
    public Telefono: string ="";
    public Perfil: PerfilUser[]=[];
  }

  export class PerfilUser{
    constructor() { }
    public ClavePerfil: string ="";
  }

  export class UserFoto {
    constructor() { }
    public Content: string ="";
    public FileName: string ="";
  }