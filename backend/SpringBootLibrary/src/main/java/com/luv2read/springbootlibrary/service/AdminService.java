package com.luv2read.springbootlibrary.service;

import com.luv2read.springbootlibrary.dao.BookRepository;
import com.luv2read.springbootlibrary.entity.Book;
import com.luv2read.springbootlibrary.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    private BookRepository bookRepository;

    @Autowired
    public AdminService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
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


}
