package com.luv2read.springbootlibrary.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import com.luv2read.springbootlibrary.dao.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

}
