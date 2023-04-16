package com.luv2read.springbootlibrary.service;

import com.luv2read.springbootlibrary.dao.BookRepository;
import com.luv2read.springbootlibrary.dao.CheckoutRepository;
import com.luv2read.springbootlibrary.dao.ReviewRepository;
import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;

    @Autowired
    public AdminService(BookRepository bookRepository, ReviewRepository reviewRepository, CheckoutRepository checkoutRepository){
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    //Route of increasing book quantity (only for admin)
    public void increaseBookQuantity(Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book was not found");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        bookRepository.save(book.get());

    }

    //Route for decreasing book quantity

    public void decreaseBookQuantity(Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0){
            throw new Exception("Book was not found or quantity locked");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        bookRepository.save(book.get());

    }

    //creating a new book
    public void postBook(AddBookRequest addBookRequest){

        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImage(addBookRequest.getImg());

        bookRepository.save(book);

    }

    //delete a book
    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book was not found");
        }

        bookRepository.delete(book.get());
//        reviewRepository.deleteAllByBookId(bookId);
        checkoutRepository.deleteAllByBookId(bookId);
    }


}
