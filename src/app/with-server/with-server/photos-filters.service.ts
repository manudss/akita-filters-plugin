import {Injectable} from '@angular/core';
import {PhotosState} from './state/photos-store.service';
import {AkitaFiltersPlugin} from 'akita-filters-plugin';
import {PhotosQuery} from './state/users-query.service';
import {HashMap} from '@datorama/akita';
import {PhotosService} from './state/photos.service';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class PhotosFiltersService extends AkitaFiltersPlugin<PhotosState> {

  constructor(protected query: PhotosQuery, protected photosApi: PhotosService) {
    super(query);
    this.withServer(this.getOnChangeFilter());
  }


  public getOnChangeFilter() {
    return (filtersNormalized: string | HashMap<any>) => {
      return this.photosApi.get({params: filtersNormalized as HashMap<any>});
    };
  }
}
