export class facturasBusqueda {
    constructor() {}
    public FechaInicial:string = "";
    public FechaFinal:string = "";
    public Pedimento:string = "";

    Clean() {
        this.FechaInicial = "";
        this.FechaFinal = "";
        this.Pedimento = "";
    }
}

/* export class NuevaBusquedaFinanzas {
    constructor() {}
    public FechaInicial:string = "";
    public FechaFinal:string = "";
    public Pedimento:string = "";

    clean(){
        this.FechaInicial = "";
        this.FechaFinal = "";
        this.Pedimento = "";  
    }
} */