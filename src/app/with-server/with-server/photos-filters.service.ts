import {Injectable} from '@angular/core';
import {PhotosState} from './state/photos-store.service';
import {AkitaFiltersPlugin} from 'akita-filters-plugin';
import {PhotosQuery} from './state/users-query.service';
import {HashMap} from '@datorama/akita';
import {PhotosService} from './state/photos.service';
import {PhotosModel} from './state/photosModel';
import {HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class PhotosFiltersService extends AkitaFiltersPlugin<PhotosState> {
  constructor(protected query: PhotosQuery, protected photosApi: PhotosService) {
    super(query);
    this.withServer(this.getOnChangeFilter(), {withSort: true, sortByKey: '_sort', sortByOrderKey: '_order'});
  }

  private _total$ = new BehaviorSubject<number>(0);

  get total$(): Observable<number> {
    return this._total$.asObservable();
  }

  public getOnChangeFilter() {
    return (filtersNormalized: string | HashMap<any>) => {
      const filtersObject = filtersNormalized as HashMap<any>;
      if (filtersObject?._page) {
        filtersObject._page = filtersObject._page + 1;
      }
      return this.photosApi.get({
        params: filtersObject,
        mapResponseFn: (res: HttpResponse<PhotosModel[]>): PhotosModel[] => {
          this._total$.next(Number(res.headers.get('x-total-count')));

          return res.body;
        },
        observe: 'response', // <----- this was to access to header of the request
      });
    };
  }
}
