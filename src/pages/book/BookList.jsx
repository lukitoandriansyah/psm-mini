import {useEffect, useState} from "react";

export default function BookList(){
    const [books, setBooks] = useState([])

    async function getBooks(){
        const res = await fetch("https://be-library-mini-system.herokuapp.com/book/books",
            {method:"GET"})
        const data = await res.json();
        setBooks(data);
    }

    useEffect(()=>{
        getBooks()
    },[])

    return<>
        <h1>Daftar Buku</h1>

        <br/><br/>

        <table width={"100%"} border={"1"}>
            <thead>
            <tr>
                <th>Book Id</th>
                <th>Book Title</th>
                <th>Book Category</th>
                <th>Book Year</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Book Status</th>
            </tr>
            </thead>
            <tbody>
            {books.map(book=>
                <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td>{book.bookTitle}</td>
                    <td>{book.categoryName}</td>
                    <td>{book.bookYear}</td>
                    <td>{book.authorName}</td>
                    <td>{book.publisherName}</td>
                    <td>{book.bookStatus === true ? "Tersedia":"Dipinjam"}</td>
                </tr>
            )}
            </tbody>
        </table>

    </>
}