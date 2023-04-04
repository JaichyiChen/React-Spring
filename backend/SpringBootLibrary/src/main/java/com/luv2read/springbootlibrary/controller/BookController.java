package com.luv2read.springbootlibrary.controller;

import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.responseModels.ShelfCurrentLoansResponse;
import com.luv2read.springbootlibrary.service.BookService;
import com.luv2read.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired //not necessary
    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    //getting books currently loaned
    @GetMapping("/secure/currentLoans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value="Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }


    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value="Authorization") String token,
                             @RequestParam Long bookId) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        return bookService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookUser(@RequestHeader(value="Authorization") String token,
                                    @RequestParam Long bookId){
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        return bookService.checkoutByBookUser( userEmail,bookId);
    }

    @GetMapping("/secure/currentLoans/count")
    public int currentLoansCount(@RequestHeader(value="Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        return bookService.currentLoansCount(userEmail);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value="Authorization") String token,
                           @RequestParam Long bookId)
    throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan (@RequestHeader(value="Authorization") String token,
                           @RequestParam Long bookId)
            throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.renewBook(userEmail, bookId);
    }
}
