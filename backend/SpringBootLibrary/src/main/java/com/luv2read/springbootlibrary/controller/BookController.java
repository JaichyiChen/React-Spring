package com.luv2read.springbootlibrary.controller;

import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired //not necessary
    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception{
        String userEmail = "testuser@email.com";
        return bookService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookUser(@RequestParam Long bookId){
        String userEmail = "testuser@email.com";
        return bookService.checkoutByBookUser( userEmail,bookId);
    }

    @GetMapping("/secure/currentLoans/count")
    public int currentLoansCount(){
        String userEmail = "testuser@email.com";
        return bookService.currentLoansCount(userEmail);
    }
}
