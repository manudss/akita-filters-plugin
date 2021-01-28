export interface PhotosModel {
  'albumId': number;
  'id': number;
  'title': string;
  'url': string;
  'thumbnailUrl': string;
}

export function createPhotos(params: Partial<PhotosModel>) {
  return {

  } as PhotosModel;
}
