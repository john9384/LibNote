class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  static displayBooks() {
    const books = LocalStore.getBooks();
    books.forEach(book => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> <a href="#" class="delete btn red darken-4"> delete </a></td>`;

    list.appendChild(row);
  }

  static deleteBook(e) {
    if (e.classList.contains("delete")) {
      e.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector("#container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 1000);
  }

  static clearFields() {
    document.getElementById("book-title").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-isbn").value = "";
  }
}
class LocalStore {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = LocalStore.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = LocalStore.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
//Display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Add a book
document.getElementById("book-form").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;
  const isbn = document.getElementById("book-isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill all field", "danger");
  } else {
    const book = new Book(title, author, isbn);

    UI.addBookToList(book);
    LocalStore.addBook(book);
    UI.showAlert("Book added", "success");
    UI.clearFields();
  }
});

//Deleting a book
document.getElementById("book-list").addEventListener("click", e => {
  UI.deleteBook(e.target);
  LocalStore.removeBook(
    e.target.parentElement.previousElementSibling.textContent
  );
  UI.showAlert("Book Deleted", "success");
});
