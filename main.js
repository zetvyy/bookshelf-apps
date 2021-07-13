const UNREAD_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

document.addEventListener("DOMContentLoaded", function(){

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan")
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});


function addBook(){
    const unreadBookList = document.getElementById(UNREAD_BOOK_ID);
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;

    const bookList = makeBookList(inputTitle, inputAuthor, inputYear, false);
    const bookListObject = composeBookshelfObject(inputTitle, inputAuthor, inputYear, false);

    bookList[BOOK_ITEMID] = bookListObject.id; 
    books.push(bookListObject);

    unreadBookList.append(bookList);
    updateDataToStorage();
}

function makeBookList(data1, data2, timestamp, isCompleted) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = data1;

    const bookAuthor = document.createElement("i");
    bookAuthor.classList.add("author");
    bookAuthor.innerText = data2;
    
    const bookYear = document.createElement("p");
    bookYear.classList.add("year");
    bookYear.innerText = timestamp;
    

    const textContainer = document.createElement("article");
    textContainer.classList.add("book_item");
    textContainer.append(bookTitle, bookAuthor, bookYear);

    const action = document.createElement("div");
    action.classList.add("action");
    textContainer.append(action);

    if(isCompleted){
        action.append(
            createUndoButton(),
            createRedButton());
    } else {
        action.append(createGreenButton()),
        action.append(createRedButton());
    }
    return textContainer;
}

function createButton(buttonTypeClass, eventListener, textButton) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = textButton;
    button.addEventListener("click", function(event){
        eventListener(event);
    });
    return button;
}

function addBookToCompleted(bookListElement) {
    const bookTitle = bookListElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookListElement.querySelector(".book_item > .author").innerText;
    const bookYear = bookListElement.querySelector(".book_item > .year").innerText;

    const newBookList = makeBookList(bookTitle, bookAuthor, bookYear, true);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const book = findBook(bookListElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBookList[BOOK_ITEMID] = book.id;
   
    listCompleted.append(newBookList);
    bookListElement.remove();

    updateDataToStorage();
}

function createGreenButton(){
    return createButton(
        "green",
        function(event){
            addBookToCompleted(event.target.parentElement.parentElement);
        },
        "Selesai dibaca"
    );
};

function removeBookFromCompleted(bookListElement){

    const bookPosition = findBookIndex(bookListElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    alert("yakin menghapus buku ini dari rak?");
        
    bookListElement.remove(); 
    updateDataToStorage();
}

function createRedButton() {
    return createButton("red", function(event){
        removeBookFromCompleted(event.target.parentElement.parentElement);
    },
    "Hapus Buku"
    );
};

function undoBookFromCompleted(bookListElement){
    const listUncompleted = document.getElementById(UNREAD_BOOK_ID);
    const bookTitle = bookListElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookListElement.querySelector(".book_item > .author").innerText;
    const bookYear = bookListElement.querySelector(".book_item > .year").innerText;

    const newBookList = makeBookList(bookTitle, bookAuthor, bookYear, false);
    
    const book = findBook(bookListElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBookList[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBookList);
    bookListElement.remove();

    updateDataToStorage();
}

function createUndoButton(){
    return createButton(
        "green",
        function(event){
            undoBookFromCompleted(event.target.parentElement.parentElement);
        },
        "Belum Selesai dibaca"
    );
};

const searchButton = document.getElementById("searchSubmit");
searchButton.addEventListener("click", () => {
    event.preventDefault();
    searchData();
})

function searchData() {
    const searchValue = document.querySelector("#searchBookTitle").value.toLowerCase();
    const books = document.querySelectorAll(".book_item");

    for(book of books) {
        const title = book.firstElementChild.textContent.toLowerCase();
       
        if (title.toLowerCase().includes(searchValue)) {
            book.style.display = "block"
        } else {
            book.style.display = "none"
        }
    }
};