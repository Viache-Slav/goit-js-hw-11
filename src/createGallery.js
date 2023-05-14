export const createGallery = pictures => {
    return pictures.data.hits
      .map(picture => {
        return `<div class="photo-card">
    <a href="${picture.largeImageURL}"><img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${picture.likes}
      </p>
      <p class="info-item">
        <b>Views</b>${picture.views}
      </p>
      <p class="info-item">
        <b>Comments</b>${picture.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${picture.downloads}
      </p>
    </div>
  </div>`;
      })
      .join('');
  };