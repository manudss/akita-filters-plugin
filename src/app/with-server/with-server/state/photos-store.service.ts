import { Injectable } from '@angular/core';
import { PhotosModel } from './photosModel';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface PhotosState extends EntityState<PhotosModel> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'photosStore'  })
export class PhotosStore extends EntityStore<PhotosState> {

  constructor() {
    super();
  }

}

