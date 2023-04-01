package com.luv2read.springbootlibrary.dao;

import com.luv2read.springbootlibrary.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);

    //passing in a List instead of single param, need to write custom query
    //i is a reference
    //select book id from the Books in the db, where the book id matches in the list of ids
    @Query("select i from Book i where id in :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids")List<Long> bookId);
}
