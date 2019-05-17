export class BitacorasBusqueda {
    constructor() { }    
    public FechaInicial:string = "";    
    public FechaFinal:string = "";        
    public Modulo:string = "";    
    public IdCuentaEspecifica:string = "";    

    Clean() {
        this.FechaInicial = "";    
        this.FechaFinal = "";        
        this.Modulo = "";    
        this.IdCuentaEspecifica = "";    
    }
}

export class CalculoManiobra {
    constructor() { }    
    public TipoEntrada:string = "";    
    public Peso:string = "";        
    public ValorAduana:string = "";    
    public FechaEntrada:string = "";    
    public FechaSalida:string = "";    
    public ConceptoCadenaFria:string = "";    

    Clean() {
        this.TipoEntrada = "";    
        this.Peso = "";        
        this.ValorAduana = "";    
        this.FechaEntrada = "";    
        this.FechaSalida = "";    
        this.ConceptoCadenaFria = "";    
    }
}

export class ResCalculoManiobra {
    constructor() { }    
    public CostoAlmacenaje:string = "";    
    public CostoCustodia:string = "";        
    public CostoManiobra:string = "";    
    public CostoRefrigeracion:string = "";    
    public CostoCongelacion:string = "";    
    public CostoTEC:string = "";    
    public CostoPrevio:string = "";    
    public Subtotal:string = "";    
    public IVA:string = "";    
    public Total:string = "";    

    Clean() {
        this.CostoAlmacenaje = "";    
        this.CostoCustodia = "";        
        this.CostoManiobra = "";    
        this.CostoRefrigeracion = "";    
        this.CostoCongelacion = "";    
        this.CostoTEC = "";    
        this.CostoPrevio = "";    
        this.Subtotal = "";    
        this.IVA = "";    
        this.Total = "";    
    }
}

