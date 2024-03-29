import "./style.css";
import "./utils/bling";

// State
let state = { id: 0, todos: [] };

function app() {
  // UI
  let ui = {
    input: $("input"),
    form: $("form"),
    todos: $("#todos"),
  };

  //return mk("div", { id: "app" }, [
  const header = mk("div", { id: "header" }, [
    mk("h1", null, ["Todo App: AltSchool Frontend Version"]),
    (ui.form = mk("form", { id: "form" }, [
      (ui.input = mk("input", {
        className: "todo",
        type: "text",
        id: "todo",
        placeholder: "Enter a task...",
      })),
      mk(
        "button",
        { type: "submit", onclick: add },
        //["Add"]
        [mk("img", { src: "icons/plus.png", alt: "Add" })]
      ),
    ])),
    (ui.todos = mk("ul", { id: "todos" })),
  ]);

  const mainContainer = mk("div", { id: "main-container" }, [header]);

  return mainContainer;

  function createTodoElement(todo) {
    let item, text, deleteItem, updateItem, completedItem;

    item = mk("li", { className: "todo-item", "data-id": todo.id }, [
      (text = mk("span", { className: "todo-text", id: `text-${todo.id}` }, [
        todo.text,
      ])),
      (deleteItem = mk(
        "button",
        {
          className: "button delete",
          id: `delete-${todo.id}`,
          onclick: () => remove(todo.id),
        },
        //["Delete"]
        [mk("img", { src: "icons/delete.png", alt: "Delete" })]
      )),
      (updateItem = mk(
        "button",
        {
          className: "button update",
          id: `update-button-${todo.id}`,
          onclick: () => toggleEdit(todo.id),
        },
        //["Update"]
        [mk("img", { src: "icons/refresh.png", alt: "Update" })]
      )),
      (completedItem = mk(
        "button",
        {
          className: "button complete",
          id: `completed-button-${todo.id}`,
          onclick: () => toggleCompleted(todo.id),
        },
        [mk("img", { src: "icons/checked.png", alt: "Complete" })]
      )),
    ]);

    if (todo.completed) {
      text.classList.add("completed");
    }

    return item;
  }

  function add(event) {
    event.preventDefault();

    const text = ui?.input.value;

    if (!text) return;

    const todo = { text, completed: false, id: Date.now() };
    ui.input.value = "";

    state.todos.push(todo);

    renderTodos();
  }
  function remove(todoId) {
    console.log("Deleting");

    // Find first
    const index = state.todos.findIndex((todo) => todo.id === todoId);
    if (index !== -1) {
      // Remove item from state
      state.todos.splice(index, 1);
      renderTodos();
    }
  }

  function toggleEdit(todoId) {
    console.log("editing...");
    const currentText = document.getElementById(`text-${todoId}`);

    console.log("currentText:", currentText);

    const text = currentText.textContent;

    const textInput = mk("input", {
      id: `text-input-${todoId}`,
      value: text,
      className: "update-input",
    });

    currentText.replaceWith(textInput);

    const saveButton = mk(
      "button",
      { id: `save-button-${todoId}`, onclick: () => update(todoId) },
      //["Save"]
      [mk("img", { src: "icons/changes.png", alt: "Saved" })]
    );

    const updateButton = document.getElementById(`update-button-${todoId}`);
    updateButton.replaceWith(saveButton);
  }

  function update(todoId) {
    console.log("Updating");

    const textInput = document.getElementById(`text-input-${todoId}`);
    if (!textInput) {
      console.error(`textInput element not found`);
      return;
    }

    const newText = textInput.value.trim();

    if (newText !== "") {
      // we need to create a new span element with the now updated text
      const newSpan = mk("span", { id: `text-${todoId}` }, [newText]);

      // and then replace it
      textInput.replaceWith(newSpan);

      updateTodoInState(todoId, newText);
    }
  }

  function updateTodoInState(todoId, newText) {
    const todoToUpdate = state.todos.find((todo) => todo.id === todoId);
    if (todoToUpdate) {
      todoToUpdate.text = newText;
      renderTodos();
    }
  }

  function toggleCompleted(todoId) {
    const textElement = document.getElementById(`text-${todoId}`);
    if (textElement) {
      // Toggle the completed class on the text element
      textElement.classList.toggle("completed");

      // Toggle the not-completed class on the button element
      const completedButton = document.getElementById(
        `completed-button-${todoId}`
      );
      if (completedButton) {
        completedButton.classList.toggle("not-completed");
      }

      // Find the todo in state and update its completed status
      const todoToUpdate = state.todos.find((todo) => todo.id === todoId);
      if (todoToUpdate) {
        todoToUpdate.completed = !todoToUpdate.completed;
      }
    }
  }

  function renderTodos() {
    ui.todos.innerHTML = "";
    state.todos.forEach((todo) => {
      const todoElement = createTodoElement(todo);
      ui.todos.appendChild(todoElement);
    });
  }
}

function render() {
  document.body.prepend(app());
}

render();
