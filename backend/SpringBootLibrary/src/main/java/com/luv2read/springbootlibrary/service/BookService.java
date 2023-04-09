package com.luv2read.springbootlibrary.service;


import com.luv2read.springbootlibrary.dao.BookRepository;
import com.luv2read.springbootlibrary.dao.CheckoutRepository;
import com.luv2read.springbootlibrary.dao.HistoryRepository;
import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.entity.Checkout;
import com.luv2read.springbootlibrary.entity.History;
import com.luv2read.springbootlibrary.responseModels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
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

    private HistoryRepository historyRepository;


    //constructor injection
    @Autowired
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository){
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
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
    //return book for user
    public void returnBook (String userEmail, Long bookId) throws Exception{
            Optional<Book> book = bookRepository.findById(bookId);
            //check in db that there is a record of current userEmail with the bookId
            Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

            if(!book.isPresent() || validateCheckout == null){
                throw new Exception("Book doesn't exist or not checked out by user");
            }

            //add available book count + 1
            book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);
            bookRepository.save(book.get());

            //delete the entry in checkout repo
            checkoutRepository.deleteById(validateCheckout.getId());

            //saving book history into db
            History history = new History(userEmail,
                    validateCheckout.getCheckoutDate(),
                    validateCheckout.getReturnDate(),
                    book.get().getTitle(),
                    book.get().getAuthor(),
                    book.get().getDescription(),
                    book.get().getImage()
            );

            historyRepository.save(history);
    }

    //renew the book for another 7 days
    public void renewBook(String userEmail, Long bookId) throws Exception{
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(validateCheckout == null){
            throw new Exception("Book doesn't exist or not checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());
        //compare if the book is within the due date
        if(d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0){
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
        }

        checkoutRepository.save(validateCheckout);
    }
}
