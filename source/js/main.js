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

    if (results.length <= 0) {
      $('.section-table').hide();
      $('.error-section').show();
    } else {
      $('.error-section').hide();
      showTable();

      results.forEach(data => {
        const row = templateTr.cloneNode(true);
        const numRepo = row.querySelector('.colNumber');
        const repoTable = row.querySelector('.colRepo');
        const userTable = row.querySelector('.colUser');
        const avatar = row.querySelector('.colAvatar');

        const repoInfo = {
          repoName: data.name,
          stars: data.stargazers_count,
          userName: data.owner.login,
          userId: data.owner.id,
          userURL: data.owner.html_url,
          repoURL: data.html_url,
          forks: data.forks,
          lang: data.language
        }

        numRepo.textContent = repoInfo.stars;
        repoTable.textContent = repoInfo.repoName;
        userTable.textContent = repoInfo.userName;
        avatar.innerHTML = `<img src=https://avatars3.githubusercontent.com/u/${repoInfo.userId}?v=4>`;

        row.addEventListener('click', () =>
          openModal(repoInfo));

        fragment.append(row)
      });

      document.querySelector('#body-table').append(fragment)
    };
  })
}

// Событие отправки формы
const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  getSearchResults(`https://api.github.com/search/repositories?q=${inputSearch.value}&per_page=${repoQuantity.value}&sort=${repoSort.value}`);
});

const openModal = ({
  repoName,
  stars,
  userName,
  userId,
  userURL,
  repoURL,
  forks,
  lang
}) => {
  $('#exampleModal').modal('show');
  $('#exampleModalLabel a  span').text(repoName);
  $('#exampleModalLabel a').attr('href', userURL);
  $('.main-repo a  span').text(userName);
  $('.main-repo a').attr('href', repoURL);
  $('.user-avatar').html(`<img src=https://avatars3.githubusercontent.com/u/${userId}?v=4>`);
  $('.details__icon--forks span').text(forks);
  $('.details__icon--stars span').text(stars);
  $('.details__icon--language svg').attr('fill', langColors[lang]);
  $('.details__icon--language span').text(lang);
};


