$(document).ready(() => {
    const $form = $('#todoForm');
    const $taskInput = $('#taskInput');
    const $todoList = $('#todoList');
  
    // lataa tehtävät localstoragesta
    loadTasks();
  
    // Lomakkeen lähetyksen käsittely
    $form.on('submit', (e) => {
      e.preventDefault();
      const taskText = $taskInput.val().trim();
  
      if (taskText === '') {
        showError('Tehtävä ei voi olla tyhjä!');
        return;
      }
  
      if (taskText.length < 3) {
        showError('Tehtävän tulee olla vähintään 3 merkkiä pitkä!');
        return;
      }
  
      addTask(taskText);
      $taskInput.val('');
      $taskInput.removeClass('error');
    });
  
    // Lisää tehtävää listalle
    function addTask(taskText, completed = false) {
      const $li = $('<li>')
        .addClass('list-group-item d-flex justify-content-between align-items-center')
        .attr('draggable', true) // Tee elementistä vedettävä
        .hide(); // Lisää tehtävä aluksi piilossa
  
      const $completeButton = $('<button>')
        .text(completed ? 'Palauta tehtäväksi' : 'Merkitse hoidetuiksi')
        .addClass(`btn ${completed ? 'btn-warning' : 'btn-success'} btn-sm complete`);
  
      const $removeButton = $('<button>')
        .text('Poista')
        .addClass('btn btn-danger btn-sm remove');
  
      // lisää tehtävä hoidetuksi tai ei hoidetuksi
      $completeButton.on('click', () => {
        if ($li.hasClass('completed')) {
          $li.removeClass('completed text-decoration-line-through text-muted');
          $completeButton.text('Merkitse hoidetuiksi').removeClass('btn-warning').addClass('btn-success');
        } else {
          $li.addClass('completed text-decoration-line-through text-muted');
          $completeButton.text('Palauta tehtäväksi').removeClass('btn-success').addClass('btn-warning');
        }
        saveTasks();
      });
  
      // Poista tehtävä
      $removeButton.on('click', () => {
        $li.slideUp(() => {
          $li.remove();
          saveTasks();
        });
      });
  
      // drag-and-drop
      $li.on('dragstart', (e) => {
        e.originalEvent.dataTransfer.setData('text/plain', $li.index());
      });
  
      $li.on('dragover', (e) => {
        e.preventDefault();
      });
  
      $li.on('drop', (e) => {
        e.preventDefault();
        const draggedIndex = e.originalEvent.dataTransfer.getData('text/plain');
        const $draggedItem = $todoList.children().eq(draggedIndex);
        const $dropTarget = $li;
  
        if ($draggedItem[0] !== $dropTarget[0]) {
          if ($draggedItem.index() < $dropTarget.index()) {
            $dropTarget.after($draggedItem);
          } else {
            $dropTarget.before($draggedItem);
          }
          saveTasks();
        }
      });
  
      $li.append(taskText).append($completeButton).append($removeButton);
      $li.appendTo($todoList).fadeIn();
      saveTasks();
    }
  
    // tallenna tehtävät localstorageen
    function saveTasks() {
      const tasks = [];
      $todoList.children('li').each(function () {
        const taskText = $(this).clone().children().remove().end().text().trim();
        const isCompleted = $(this).hasClass('completed');
        tasks.push({ text: taskText, completed: isCompleted });
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Lataa tehtävät localstoragesta
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => addTask(task.text, task.completed));
    }
  
    // virheilmoitukset
    function showError(message) {
      $taskInput.addClass('error');
      alert(message);
    }
});