import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Movie } from '../model/movie';
import { MovieService } from '../services/movie.service';
import { MessageBarService } from 'src/app/material/material.module';

/**
 * Component representing a Movie.
 */
@Component({
  selector: 'mdb-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {

  /**
   * Movie input
   */
  @Input()
  movie: Movie;

  /**
   * Event to emit when the list of movies should be changed.
   * i.e The related movies are loaded an the parent component
   * should be notified to change the list of movies.
   */
  @Output()
  changeMovieList: EventEmitter<Movie[]> = new EventEmitter();

  /**
   * True if the component is currently loading data
   */
  isDetailsLoading = false;

  constructor(private _service: MovieService, private _messageService: MessageBarService) { }

  /**
   * Asynchronous action to load and show movie details.
   */
  async showDetails() {
    this.isDetailsLoading = true;
    try {
      const wikiResult = await this._service.getWikipediaInfo(this.movie);
      this.movie.wikipediaInfo = wikiResult;
    } catch (error) {
      this._messageService.showMessage('Error while loading wikipedia information! Please check the console for more information.');
      console.log(error);
    }
    if (!this.movie.wikipediaInfo) {
      this._messageService.showMessage('Could not find a Wikipedia page for this movie! :(');
    }
    this.isDetailsLoading = false;
  }

  /**
   * Asynchronous action to load related movies and emit
   * a 'changedMovieList' event.
   */
  async loadRelatedMovies() {
    this.isDetailsLoading = true;
    try {
      const relatedMovies = await this._service.getRelatedMovies(this.movie);
      this.changeMovieList.emit(relatedMovies);
    } catch (error) {
      this._messageService.showMessage('Could not load related movies for this movie! :(');
      console.log(error);
    }
    this.isDetailsLoading = false;
  }

  /**
   * Destructor of current component's wikipedia info
   */
  closeDetails() {
    delete this.movie.wikipediaInfo;
  }
}
