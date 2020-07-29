const inputSearch = document.querySelector('.input-search');
const buttonSearch = document.querySelector('.button-search');
const templateTr = document.querySelector('#template-tr').content.querySelector('tr');
const bodyTable = document.querySelector('#body-table');

// const select
const repoSort = document.querySelector('#repo-sort');
const repoQuantity = document.querySelector('#repo-quantity');

// Ф-ия отрисовки новой таблички
const showTable = () => {
  bodyTable.textContent = '';
  const sectionTable = document.querySelector('.section-table');
  sectionTable.style.display = 'block';
}

// Запрос на сервер
function getSearchResults(url) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();

  xhr.addEventListener('error', () => {
    alert('Ошибка поиска, повторите попытку')
  })

  xhr.addEventListener('load', () => {
    const results = JSON.parse(xhr.responseText).items;
    const fragment = document.createDocumentFragment();
    showTable();

    results.forEach(data => {
      const row = templateTr.cloneNode(true);
      const numRepo = row.querySelector('.colNumber');
      const repoTable = row.querySelector('.colRepo');
      const userTable = row.querySelector('.colUser');
      const avatar = row.querySelector('.colAvatar');

      const stars = data.stargazers_count;
      const repoName = data.name;
      const userName = data.owner.login;
      const userId = data.owner.id;
      const userURL = data.owner.html_url;
      const repoURL = data.html_url;
      const forks = data.forks;
      const lang = data.language;

      numRepo.textContent = stars;
      repoTable.textContent = repoName;
      userTable.textContent = userName;
      avatar.innerHTML = `<img src=https://avatars3.githubusercontent.com/u/${userId}?v=4>`;

      row.addEventListener('click', () =>
        openModal(userName, repoName, userId, repoURL, forks, lang, userURL));

      fragment.append(row)
    });

    document.querySelector('#body-table').append(fragment)
  })
}

// Событие отправки формы
const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  getSearchResults(`https://api.github.com/search/repositories?q=${inputSearch.value}&per_page=${repoQuantity.value}&sort=${repoSort.value}`);
});

const openModal = (userName, repoName, userId, repoURL, forks, lang, userURL) => {
  $('#exampleModal').modal('show');
  $('#exampleModalLabel a').text(`User name: ${userName}`)
    .attr('href', `${userURL}`);
  $('.main-repo a').text(`Repo name: ${repoName}`)
    .attr('href', `${repoURL}`);
  $('.user-avatar').html(`<img src=https://avatars3.githubusercontent.com/u/${userId}?v=4>`);
  $('.info-list').empty().append(`<li>Forks: ${forks}</li>`)
    .append(`<li>Language: ${lang}</li>`);
};
