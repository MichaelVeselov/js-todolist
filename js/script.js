window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const theme = {
    light: { background: 'initial', color: 'initial', border: 'none' },
    dark: {
      background: '#24292E',
      color: '#ffffff',
      border: '1px solid #ffffff',
    },
  };

  let isThemeLight = true;

  const tasks = [
    {
      id: '1138465078061',
      completed: false,
      text: 'Watch a new Java Script lesson',
    },
    {
      id: '1138465078062',
      completed: false,
      text: 'Perform the test after the lesson',
    },
    {
      id: '1138465078063',
      completed: false,
      text: 'Do homework after the lesson',
    },
  ];

  const body = document.querySelector('body');
  const tasksList = body.querySelector('.tasks-list');
  const tasksForm = body.querySelector('.create-task-block');

  class Task {
    constructor(options = {}) {
      this.id = options.id;
      this.completed = options.completed;
      this.text = options.text;
    }
    createTask() {
      const task = `
      <div class="task-item" data-task-id="${this.id}">
        <div class="task-item__main-container">
            <div class="task-item__main-content">
                <form class="checkbox-form">
                    <input class="checkbox-form__checkbox" type="checkbox" id="${this.id}">
                    <label for="${this.id}"></label>
                </form>
                <span class="task-item__text">${this.text}</span>
            </div>
            <button class="task-item__delete-button default-button delete-button" data-delete-task-id="5">
                Delete
            </button>
        </div>
    </div>
      `;

      return task;
    }
  }

  class Modal {
    createModal() {
      const modal = document.createElement('div');
      modal.classList.add('modal-overlay', 'modal-overlay_hidden');
      modal.innerHTML = `
        <div class="delete-modal">
            <h3 class="delete-modal__question">
            Do you really want to delete this task?
            </h3>
            <div class="delete-modal__buttons">
                <button class="delete-modal__button delete-modal__cancel-button">
                    Cancel
                </button>
                <button class="delete-modal__button delete-modal__confirm-button">
                    Delete
                </button>
            </div>
        </div>
      `;
      return modal;
    }
  }

  function handleError(message) {
    const errorBlock = document.createElement('span');
    errorBlock.classList.add('error-message-block');
    errorBlock.textContent = message;
    tasksForm.appendChild(errorBlock);
  }

  function clearInput(elem) {
    elem.value = '';
    elem.focus();
  }

  function removeErrorBlock() {
    document.querySelector('.error-message-block')?.remove();
  }

  function openModal(taskId) {
    const newModal = new Modal().createModal();
    body.appendChild(newModal);
    newModal.classList.remove('modal-overlay_hidden');

    const cancelButton = newModal.querySelector('.delete-modal__cancel-button');
    const deleteButton = newModal.querySelector('.delete-modal__confirm-button');

    cancelButton.addEventListener('click', () => {
      closeModal(newModal);
    });

    deleteButton.addEventListener('click', () => {
      deleteTask(taskId);
      closeModal(newModal);
    });
  }

  function closeModal(modal) {
    modal.remove();
  }

  function deleteTask(taskId) {
    const idx = tasks.findIndex((task) => task.id === taskId);
    tasks.splice(idx, 1);
    document.querySelector(`[data-task-id="${taskId}"]`).remove();
  }

  function setTheme(isThemeLight) {
    const taskItems = document.querySelectorAll('.task-item');
    const buttons = body.querySelectorAll('button');

    if (isThemeLight) {
      body.style.background = theme.light.background;
      taskItems.forEach((item) => {
        item.style.color = theme.light.color;
      });
      buttons.forEach((button) => {
        button.style.border = theme.light.border;
      });
    } else {
      body.style.background = theme.dark.background;
      taskItems.forEach((item) => {
        item.style.color = theme.dark.color;
      });
      buttons.forEach((button) => {
        button.style.border = theme.dark.border;
      });
    }
  }

  tasks.forEach((task) => {
    tasksList.innerHTML += new Task(task).createTask();
  });

  tasksForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.target.taskName;
    const value = input.value.trim();

    if (!value) {
      removeErrorBlock();
      handleError('The task name should not be empty.');
      clearInput(input);
      return;
    }

    if (tasks.some((task) => task.text === value)) {
      removeErrorBlock();
      handleError('Task with the same name already exists.');
      clearInput(input);
      return;
    }

    const task = {
      id: Date.now().toString(),
      completed: false,
      text: value,
    };

    removeErrorBlock();
    tasks.push(task);
    tasksList.innerHTML += new Task(task).createTask();
    clearInput(input);
  });

  tasksList.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName === 'BUTTON') {
      const taskId = target.closest('.task-item').getAttribute('data-task-id');
      openModal(taskId);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      isThemeLight = !isThemeLight;
      setTheme(isThemeLight);
    }
  });
});
