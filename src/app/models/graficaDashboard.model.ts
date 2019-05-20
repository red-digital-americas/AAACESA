export class categoryAnualData {
    constructor(){ }
    public data = [0,0,0,0,0,0,0,0,0,0,0,0];
    
    clean(){
        this.data = [0,0,0,0,0,0,0,0,0,0,0,0];
    }
}



export class widgetAnualData {
    constructor() { }
    charts: boolean;
    public Data = [new categoryAnualData(), new categoryAnualData(), new categoryAnualData(), new categoryAnualData()];
    private tipoSolicitud = ["PREALERTAS","ADELANTO PREVIOS", "ADELANTO SALIDAS", "ADELANTO ABANDONOS"];

    clean(){
        this.Data = [new categoryAnualData(), new categoryAnualData(), new categoryAnualData(), new categoryAnualData()];
    }

    public parseData(rawData:any){
        for (let i=0; i < this.tipoSolicitud.length; i ++){
            let filterData:any;
            filterData = rawData.filter ( (element) => { return element.TipoSolicitud === this.tipoSolicitud[i]; });

            for(let j=0; j < filterData.length; j++){
                let mes = parseInt(filterData[j].Month);
                let valor = parseInt(filterData[j].Valor);
                console.log(mes, valor);
                this.Data[i].data[mes] += valor;
            }
        }
    }
}
