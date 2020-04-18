import { Injectable } from '@angular/core';
import { PhotosStore, PhotosState } from './photos-store.service';
import {NgEntityService, NgEntityServiceConfig} from '@datorama/akita-ng-entity-service';
import {PhotosQuery} from './users-query.service';

@NgEntityServiceConfig({
  resourceName: 'photos',
  baseUrl: 'https://jsonplaceholder.typicode.com'
})
@Injectable({ providedIn: 'root' })
export class PhotosService extends NgEntityService<PhotosState> {


  constructor(protected store: PhotosStore, protected query: PhotosQuery) {
    super(store);
  }

}
