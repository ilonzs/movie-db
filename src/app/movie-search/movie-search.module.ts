import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from './services/movie.service';
import { MovieRequestInterceptor } from './interceptors/movie-request.interceptor';
import { MovieCardComponent } from './movie-card/movie-card.component';


@NgModule({
  declarations: [SearchComponent, MovieCardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    MovieService,
    { provide: HTTP_INTERCEPTORS, useClass: MovieRequestInterceptor, multi: true }
  ],
  exports: [
    SearchComponent
  ]
})
export class MovieSearchModule { }
