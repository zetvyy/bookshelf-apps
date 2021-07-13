const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung web storage")
        return false;
    }
    return true;
}

function saveData(){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null)
    books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if(isStorageExist())
    saveData();
}

function composeBookshelfObject(data1, data2, timestamp, isCompleted){
    return{
        id: +new Date(),
        data1,
        data2,
        timestamp,
        isCompleted 
    };
}

function findBook(bookId) {
    for(book of books){
        if(book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if(book.id === bookId)
            return index;

        index++;
    }

    return -1;
}


function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNREAD_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for(book of books) {
        const newBook = makeBookList(book.data1, book.data2, book.timestamp, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isCompleted) {
            listCompleted.append(newBook);
        } else{
            listUncompleted.append(newBook);
        }
    }
}