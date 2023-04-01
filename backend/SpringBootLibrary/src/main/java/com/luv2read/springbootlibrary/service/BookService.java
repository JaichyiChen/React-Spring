package com.luv2read.springbootlibrary.service;


import com.luv2read.springbootlibrary.dao.BookRepository;
import com.luv2read.springbootlibrary.dao.CheckoutRepository;
import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.entity.Checkout;
import com.luv2read.springbootlibrary.responseModels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

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

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception{

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponse = new ArrayList<>();

        //get's a checkout list of books checked out with the userEmail
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);

        List<Long> bookIdList = new ArrayList<>();
        for(Checkout i: checkoutList){
            bookIdList.add(i.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        //compare the loan date and return date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        //wrapping in optional because it might not exist
        //stream to loop thru and find matching book id
        //stop after first match
        for(Book book: books){
            Optional<Checkout> checkout = checkoutList.stream().filter(
                    x ->  x.getBookId() == book.getId()).findFirst();


            if(checkout.isPresent()){

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                //find the difference in date between return date and the current date
                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponse.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
            }

        }
        return shelfCurrentLoansResponse;
    }

}
