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
const getSearchResults = (url) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();

  xhr.addEventListener('error', () => {
    alert('Ошибка поиска, повторите попытку')
  })

  xhr.addEventListener('load', () => {
    const result = JSON.parse(xhr.responseText).items;
    const fragment = document.createDocumentFragment();
    showTable();

    result.forEach(data => {
      const elementTr = templateTr.cloneNode(true)
      const numRepo = elementTr.querySelector('.colNumber');
      const repoTable = elementTr.querySelector('.colRepo');
      const userTable = elementTr.querySelector('.colUser');
      const avatar = elementTr.querySelector('.avatar');

      numRepo.textContent = data.stargazers_count;
      repoTable.textContent = data.name;
      userTable.textContent = data.owner.login;
      avatar.innerHTML = `<img src=https://avatars3.githubusercontent.com/u/${data.owner.id}?v=4>`;

      fragment.append(elementTr)
    });

    document.querySelector('#body-table').append(fragment)
  })
}


// Событие отправки формы
const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  getSearchResults(`https://api.github.com/search/repositories?q=${inputSearch.value}&per_page=${repoQuantity.value}&sort=${repoSort.value}`)
})
