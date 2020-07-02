const inputSearch = document.querySelector('.input-search');
const buttonSearch = document.querySelector('.button-search');
const templateTr = document.querySelector('#template-tr').content.querySelector('tr');
const bodyTable = document.querySelector('#body-table');

// let select
let repoSort = document.querySelector('#repo-sort');
let repoQuantity = document.querySelector('#repo-quantity');

// Запрос на сервер
let getSearchResults = (url) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();

  xhr.addEventListener('error', () => {
    alert('Ошибка поиска, повторите попытку')
  })

  xhr.addEventListener('load', () => {
    const result = JSON.parse(xhr.responseText).items;
    const fragment = document.createDocumentFragment();

    result.forEach(data => {
      let elementTr = templateTr.cloneNode(true)
      let numRepo = elementTr.querySelector('.colNumber');
      let repoTable = elementTr.querySelector('.colRepo');
      let userTable = elementTr.querySelector('.colUser');

      numRepo.textContent = data.stargazers_count;
      repoTable.textContent = data.name;
      userTable.textContent = data.owner.login;

      fragment.appendChild(elementTr)
    });

    document.querySelector('#body-table').appendChild(fragment)
  })
}

// Ф-ия отрисовки новой таблички
const showTable = () => {
  bodyTable.textContent = '';
  const sectionTable = document.querySelector('.section-table');
  sectionTable.style.display = 'block';
}

// Событие отправки формы
let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  showTable();
  getSearchResults(`https://api.github.com/search/repositories?q=${inputSearch.value}&per_page=${repoQuantity.value}&sort=${repoSort.value}`)

})
