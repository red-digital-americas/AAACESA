
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileIconPipe'
})
export class FileIconPipe implements PipeTransform {
    // Asociacion de extensiones con su respectiva clase para el icono de Font Awesome
    extensions = ['pdf', 'zip', 'rar', 'txt', 'png', 'jpeg', 'jpg', 'xlsx', 'docx', 'pptx'];
    classFA = ['fa-file-pdf', 'fa-file-archive', 'fa-file-archive', 'fa-file-alt', 'fa-file-image', 'fa-file-image', 'fa-file-image', 'fa-file-excel', 'fa-file-word', 'fa-file-powerpoint', 'fa-file'];   

  transform(name: string): any {
    // Cadena despues del ultimo '.'  eg: nombreArchivo.detalle.txt
    let extensionSplit = name.split('.');
    let extension = extensionSplit[extensionSplit.length-1];  

    let index:number = this.classFA.length-1
    for (let i=0; i < this.extensions.length; i++) {
        if (this.extensions[i] === extension) { index = i; }        
    }    
    return this.classFA[index];
  }
}
