export const deleteFromCloudinary = 'deleteFromCloudinary';

export class DeleteFromCloudinaryEvent {
  constructor(public readonly publicId: string) {}
}
