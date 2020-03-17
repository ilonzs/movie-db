import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCardComponent } from './movie-card.component';
import { MaterialModule, MessageBarService } from 'src/app/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { Movie } from '../model/movie';
import { By } from '@angular/platform-browser';
import { MovieService } from '../services/movie.service';
import { WikipediaMovieInfo } from '../model/wikipedia-movie-info';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  let fakeMovieService: MovieService;
  let fakeMessageBarService: MessageBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, HttpClientModule ],
      declarations: [ MovieCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    fakeMovieService = fixture.debugElement.injector.get(MovieService);
    fakeMessageBarService = fixture.debugElement.injector.get(MessageBarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('input movie data should display correctly', () => {
    // Arrange
    const movieData: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '2000',
      imdbLink: 'gladiator_link'
    };

    // Act
    component.movie = movieData;
    fixture.detectChanges();

    // Assert
    const renderedTitle = fixture.debugElement.query(By.css('.movie-link'));
    const element: HTMLElement = renderedTitle.nativeElement;
    expect(element.innerText).toContain(movieData.title);
    expect(element.innerText).toContain(movieData.releaseYearInfo);
  });

  it('loaded wikipedia info should display correctly', async () => {
    // Arrange
    const movieData: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '2000',
      imdbLink: 'gladiator_link'
    };
    const wikipediaData: WikipediaMovieInfo = {
      title: 'Gladiator',
      wikipediaLink: 'gladiator_wiki_link',
      mainParagraph: 'gladiator_main_paragraph'
    };
    component.movie = movieData;
    fixture.detectChanges();

    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });
    spyOn(fakeMovieService, 'getWikipediaInfo').and.callFake(async (m) => {
      return wikipediaData;
    });

    // Act
    await component.showDetails();
    fixture.detectChanges();

    // Assert
    const renderedContent = fixture.debugElement
      .query(By.css('.details-content'))
      .query(By.css('p'));
    const element: HTMLElement = renderedContent.nativeElement;
    expect(element.innerText).toEqual(wikipediaData.mainParagraph);
  });

  it('if wikipedia info cannot be loaded, an error message should display', async () => {
    // Arrange
    const movieData: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '2000',
      imdbLink: 'gladiator_link'
    };
    component.movie = movieData;
    fixture.detectChanges();

    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });
    spyOn(fakeMovieService, 'getWikipediaInfo').and.callFake(async (m) => {
      throw new Error('Communication error with Wikipedia.');
    });

    // Act
    await component.showDetails();
    fixture.detectChanges();

    // Assert
    expect(fakeMessageBarService.showMessage).toHaveBeenCalled();
  });

  it('close details call should remove wikipedia info', () => {
    // Arrange
    const wikipediaData: WikipediaMovieInfo = {
      title: 'Gladiator',
      wikipediaLink: 'gladiator_wiki_link',
      mainParagraph: 'gladiator_main_paragraph'
    };
    const movieData: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '2000',
      imdbLink: 'gladiator_link',
      wikipediaInfo: wikipediaData
    };
    component.movie = movieData;
    fixture.detectChanges();

    // Act
    component.closeDetails();
    fixture.detectChanges();

    // Assert
    expect(component.movie.wikipediaInfo).toBeFalsy();
    const renderedContent = fixture.debugElement
      .query(By.css('.details-content'));
    expect(renderedContent).toBeFalsy();
  });

  it('loading related movies should emit the related movie array', async () => {
    // Arrange
    const wikipediaData: WikipediaMovieInfo = {
      title: 'Gladiator',
      wikipediaLink: 'gladiator_wiki_link',
      mainParagraph: 'gladiator_main_paragraph'
    };
    const movieData: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '2000',
      imdbLink: 'gladiator_link',
      wikipediaInfo: wikipediaData
    };
    component.movie = movieData;
    fixture.detectChanges();

    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });

    const relatedMovies: Movie[] = [{
      title: 'Movie1',
      releaseYearInfo: '1991',
      imdbLink: 'link1'
    },
    {
      title: 'Movie2',
      releaseYearInfo: '1992',
      imdbLink: 'link2'
    }];
    spyOn(fakeMovieService, 'getRelatedMovies').and.callFake(async (m) => {
      return relatedMovies;
    });

    let emittedMovies: Movie[];
    component.changeMovieList.subscribe(x => emittedMovies = x);

    // Act
    await component.loadRelatedMovies();
    fixture.detectChanges();

    // Assert
    expect(relatedMovies).toEqual(emittedMovies);
  });

  it('if related movies cannot be loaded, an error message should display', async () => {
    // Arrange
    const wikipediaData: WikipediaMovieInfo = {
      title: 'Gladiator',
      wikipediaLink: 'gladiator_wiki_link',
      mainParagraph: 'gladiator_main_paragraph'
    };
    const movieData: Movie = {
      title: 'Gladiator',
      releaseYearInfo: '2000',
      imdbLink: 'gladiator_link',
      wikipediaInfo: wikipediaData
    };
    component.movie = movieData;
    fixture.detectChanges();

    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });

    spyOn(fakeMovieService, 'getRelatedMovies').and.callFake(async (m) => {
      throw new Error('Could not load related movies.');
    });

    let emittedMovies: Movie[];
    component.changeMovieList.subscribe(x => emittedMovies = x);

    // Act
    await component.loadRelatedMovies();
    fixture.detectChanges();

    // Assert
    expect(fakeMessageBarService.showMessage).toHaveBeenCalled();
    expect(emittedMovies).toBeFalsy();
  });

});
