import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie.service';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HtmlParserService } from './html-parser.service';
import { Route } from './route';
import { Observable } from 'rxjs';
import { Movie } from '../model/movie';
import { WikipediaMovieInfo } from '../model/wikipedia-movie-info';

interface HttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType: 'text';
  withCredentials?: boolean;
}

describe('MovieService', () => {
  let service: MovieService;

  let fakeHttpClient: HttpClient;
  let fakeHtmlParser: HtmlParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    fakeHttpClient = TestBed.inject(HttpClient);
    fakeHtmlParser = TestBed.inject(HtmlParserService);
    service = new MovieService(fakeHttpClient, fakeHtmlParser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMoviesByTitle should return a movie array', async () => {
    // Arrange
    const searchString = 'movie_title';
    const htmlResponse = 'html_response';
    let returnedHtmlResponse;
    const parsedMovies: Movie[] = [];

    spyOn(fakeHttpClient, 'get').and.returnValue(new Observable(x => {
      x.next(htmlResponse);
      x.complete();
    }));
    spyOn(fakeHtmlParser, 'extractMoviesFromHtmlDocument').and.callFake(h => {
      returnedHtmlResponse = h;
      return Promise.resolve(parsedMovies);
    });

    // Act
    const result = await service.getMoviesByTitle(searchString);

    // Assert
    expect(htmlResponse).toEqual(returnedHtmlResponse);
    expect(result).toEqual(parsedMovies);
  });

  it('getRelatedMovies should return a movie array', async () => {
    // Arrange
    const movie: Movie = {
      title: 'movie_title',
      releaseYearInfo: '1992',
      imdbLink: 'link2'
    };
    const htmlResponse = 'html_response';
    let returnedHtmlResponse;
    const parsedMovies: Movie[] = [];

    spyOn(fakeHttpClient, 'get').and.returnValue(new Observable(x => {
      x.next(htmlResponse);
      x.complete();
    }));
    spyOn(fakeHtmlParser, 'extractRelatedMoviesFromHtmlDocument').and.callFake(h => {
      returnedHtmlResponse = h;
      return Promise.resolve(parsedMovies);
    });

    // Act
    const result = await service.getRelatedMovies(movie);

    // Assert
    expect(htmlResponse).toEqual(returnedHtmlResponse);
    expect(result).toEqual(parsedMovies);
  });

  it('getWikipediaInfo should return a wikipedia info for the specified movie', async () => {
    // Arrange
    const movie: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '(1992)',
      imdbLink: 'link'
    };
    const movieListHtmlResponse = 'movieList_html_response';
    const wikipediaInfoHtmlResponse = 'wikipedia_html_response';
    const foundWikipediaMovieLink = 'wikipedia_movie_link';
    const wikipediaMovieInfo: WikipediaMovieInfo = {
      title: 'Gladiator',
      wikipediaLink: 'gladiator_wiki_link',
      mainParagraph: 'gladiator_main_paragraph'
    };

    const listUrl = Route.WikipediaApi + '/' + Route.WikipediaSearch + '1992' + '_films';
    const wikiUrl = Route.WikipediaApi + '/' + foundWikipediaMovieLink;
    spyOn(fakeHttpClient, 'get')
      .withArgs(listUrl, Object({ responseType: 'text', params: Object({ from: 'Gla' }) })).and.returnValue(new Observable(x => {
        x.next(movieListHtmlResponse);
        x.complete();
      }))
      .withArgs(wikiUrl, Object({ responseType: 'text' })).and.returnValue(new Observable(x => {
        x.next(wikipediaInfoHtmlResponse);
        x.complete();
      }));
    spyOn(fakeHtmlParser, 'extractWikipediaMovieLink').and.callFake(h => {
      return Promise.resolve(foundWikipediaMovieLink);
    });
    spyOn(fakeHtmlParser, 'extractWikipediaMovieInfo').and.callFake(h => {
      return Promise.resolve(wikipediaMovieInfo);
    });

    // Act
    const result = await service.getWikipediaInfo(movie);

    // Assert
    expect(result).toEqual(wikipediaMovieInfo);
  });
});
