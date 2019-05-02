import { NgModule } from '@angular/core';

//////////////
// Pipes
import { FileIconPipe } from './fileIcon.pipe';
import { StatusPipe } from './status.pipe';
import { FilterSelectPipe } from './filterSelect.pipe';
import { DataFilterPipe } from './datafilterpipe';

@NgModule({
  imports: [        
  ],
  declarations: [    
    FileIconPipe,
    StatusPipe,
    FilterSelectPipe,
    DataFilterPipe
  ],
  exports: [
    FileIconPipe,
    StatusPipe,
    FilterSelectPipe,
    DataFilterPipe
  ]
})
export class SharedModule { }
