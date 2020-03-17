import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie } from '../model/movie';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageBarService } from 'src/app/material/material.module';

/**
 * Interface for the form searching for movie titles
 */
interface SearchMovieForm extends FormGroup {
  title: FormControl;
  errors: {};
}

/**
 * Main component to represent a movie search functionality,
 * consisting of a search form and the resulted movie list as
 * sub-components.
 */
@Component({
  selector: 'mdb-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  movieList: Movie[] = [];
  searchForm: SearchMovieForm = this.createForm();
  isLoading = false;

  constructor(private _service: MovieService, private _messageService: MessageBarService) { }

  /**
   * Method to create the reactive form for searching
   */
  private createForm(): SearchMovieForm {
    const form = <SearchMovieForm> new FormGroup({
      title: new FormControl('')
    });
    form.title = <FormControl> form.controls['title'];
    return form;
  }

  /**
   * Asynchronous action to search movies based on a title string
   * and load them in the component.
   */
  async searchMovies() {
    try {
      if (this.searchForm.title.value) {
        this.isLoading = true;
        this.searchForm.title.disable();
        this.movieList = await this._service.getMoviesByTitle(this.searchForm.title.value);
      } else {
        this._messageService.showMessage('Please provide a movie title to search for!');
      }
    } catch (error) {
      this._messageService.showMessage('Error while loading search results! Please check the console for more information.');
      console.log(error);
    }
    this.isLoading = false;
    this.searchForm.title.enable();
  }

  /**
   * Asynchronous action to load the movies from the
   * 'args' parameter movie array into the component.
   *
   * @param args Movie array to load
   */
  async loadMovies(args: Movie[]) {
    if (args) {
      this.movieList = args;
      window.scroll(0, 0);
      this._messageService.showMessage('Related movies have been loaded.');
    }
  }
}
