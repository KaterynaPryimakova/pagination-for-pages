export function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
            <a class="img-link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" /></a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b> ${likes}
              </p>
              <p class="info-item">
                <b>Views</b> ${views}
              </p>
              <p class="info-item">
                <b>Comments</b> ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> ${downloads}
              </p>
            </div>
          </div>`;
      }
    )
    .join('');
}

export function createMarkupPagination(totalPages) {
  const arrPage = [];
  for (let i = 1; i <= totalPages; i += 1) {
    const item = `<li class="item-page">${i}</li>`;
    arrPage.push(item);
  }
  const stringPage = arrPage.join('');
  return stringPage;
}
