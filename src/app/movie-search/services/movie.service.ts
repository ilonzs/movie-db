import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../model/movie';
import { WikipediaMovieInfo } from '../model/wikipedia-movie-info';
import { HtmlParserService } from './html-parser.service';
import { Route } from './route';



/**
 * REST service for movie-releated queries
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private _httpClient: HttpClient, private _htmlParser: HtmlParserService) { }

  /**
   * Get movies based on movie title.
   *
   * @param movieTitle Movie title to search for
   * @returns Promise of resulted movie array
   */
  async getMoviesByTitle(movieTitle: string): Promise<Movie[]> {
    const htmlResponse = await this._httpClient.get(this.joinRoute(Route.ImdbApi, Route.ImdbSearch),
      {
        responseType: 'text',
        params: { title: movieTitle }
      }).toPromise();

    return await this._htmlParser.extractMoviesFromHtmlDocument(htmlResponse);
  }

  /**
   * Get related movies to parameter 'movie'
   *
   * @param movie Subject of searching
   * @returns Promise of related movie array
   */
  async getRelatedMovies(movie: Movie): Promise<Movie[]> {
    const htmlResponse = await this._httpClient.get(movie.imdbLink.replace(Route.ImdbUrl, Route.ImdbApi),
      {
        responseType: 'text',
        params: {}
      }).toPromise();

    return await this._htmlParser.extractRelatedMoviesFromHtmlDocument(htmlResponse);
  }

  /**
   * Get Wikipedia info for parameter 'movie'
   *
   * @param movie Subject of searching
   * @returns Promise of resulted wikipedia info
   */
  async getWikipediaInfo(movie: Movie): Promise<WikipediaMovieInfo> {
    let result: WikipediaMovieInfo;
    const year = Number(movie.releaseYearInfo.substring(1, 5));
    const searchString = movie.title.startsWith('the') || movie.title.startsWith('The') ?
      movie.title.substr(4, 3) : movie.title.substr(0, 3);

    const matchesHtml = await this._httpClient.get(this.joinRoute(Route.WikipediaApi, Route.WikipediaSearch + year + '_films'),
      {
        responseType: 'text',
        params: { from: searchString }
      }).toPromise();

    const foundMovieLink = await this._htmlParser.extractWikipediaMovieLink(matchesHtml, movie.title);

    if (foundMovieLink) {
      const wikiInfoHtml = await this._httpClient.get(this.joinRoute(Route.WikipediaApi, foundMovieLink),
        {
          responseType: 'text'
        }).toPromise();

      result = await this._htmlParser.extractWikipediaMovieInfo(wikiInfoHtml, movie.title, foundMovieLink);
    }

    return result;
  }

  private joinRoute(base: string, args: string) {
    return base + '/' + args;
  }

}
