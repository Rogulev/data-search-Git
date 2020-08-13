$(document).ready(function () {

  const $inputSearch = $('.input-search');
  // const select
  const $repoSort = $('#repo-sort');
  const $repoQuantity = $('#repo-quantity');

  // Ф-ия отрисовки новой таблички
  const $showTable = () => {
    $('#body-table').text('');
    $('.section-table').show()
  }

  // Событие отправки формы
  $('#search-form').on('submit', (evt) => {
    evt.preventDefault();
    getSearchResults();
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


  // Запрос на сервер
  function getSearchResults() {
    $.ajax({
      type: 'GET',
      url: `https://api.github.com/search/repositories?q=${$inputSearch.val()}&per_page=${$repoQuantity.val()}&sort=${$repoSort.val()}`,
      success: function (data) {
        const $results = $(data.items);
        const $fragment = $(document.createDocumentFragment());
        if ($results.length <= 0) {
          $('.section-table').hide();
          $('.error-section').show();
        } else {
          $('.error-section').hide();
          $showTable();

          $results.each((index, value) => {
            const $templateTr = $('#template-tr').clone('tr').contents();
            const $numRepo = $($templateTr).find('.colNumber');
            const $repoTable = $($templateTr).find('.colRepo');
            const $userTable = $($templateTr).find('.colUser');
            const $avatar = $($templateTr).find('.colAvatar');

            const repoInfo = {
              repoName: value.name,
              stars: value.stargazers_count,
              userName: value.owner.login,
              userId: value.owner.id,
              userURL: value.owner.html_url,
              repoURL: value.html_url,
              forks: value.forks,
              lang: value.language
            }

            $numRepo.text(repoInfo.stars);
            $repoTable.text(repoInfo.repoName);
            $userTable.text(repoInfo.userName);
            $avatar.html(`<img src=https://avatars3.githubusercontent.com/u/${repoInfo.userId}?v=4>`);

            $templateTr.on('click', () =>
              openModal(repoInfo));

            $fragment.append($templateTr);
            console.log($fragment);
          });
          console.log($results)
          $('#body-table').append($fragment)
          console.log($fragment)
        };

      }
    })
  };
});
