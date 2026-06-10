export const isPhotoImage = (image: string) =>
  image.startsWith("/assets") || image.startsWith("https://") || image.startsWith("http://");
