package com.luv2read.springbootlibrary.service;


import com.luv2read.springbootlibrary.dao.BookRepository;
import com.luv2read.springbootlibrary.dao.CheckoutRepository;
import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.entity.Checkout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;


    //constructor injection
    @Autowired
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository){
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception{

        //Jpa repo returns Optional
        Optional<Book> book = bookRepository.findById(bookId);

        //check if entry already exist in checkout table
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0){
            throw new Exception("Book doesn't exist or already checked out by the user");
        }

        //update in book table
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());


        //creating new record in checkout table in DB with user email, today's date and return date
        Checkout checkout = new Checkout(
                userEmail, LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutByBookUser(String userEmail, Long bookId){
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(validateCheckout != null){
            return true;
        }
        else{
            return false;
        }
    }
    public int currentLoansCount(String userEmail){
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        return checkoutList.size();
    }
}
