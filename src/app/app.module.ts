import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { MatIconModule, MatInputModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SliderComponent } from './slider.component/slider.component';

import { OptionsService } from './options.service';


@NgModule({
  declarations: [
    AppComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule, NoopAnimationsModule, FormsModule, 
    MatIconModule, MatInputModule, MatSliderModule, MatTabsModule 
  ],
  providers: [OptionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
