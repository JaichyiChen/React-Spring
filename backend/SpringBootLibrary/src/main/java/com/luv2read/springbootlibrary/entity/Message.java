package com.luv2read.springbootlibrary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="message")
@Data
public class Messages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    private String email;

    private String title;

    private String question;

    private String adminEmail;

    private String response;

    private boolean closed;

    public Messages(){

    }
    public Messages(Long id, String email, String title, String question, String adminEmail, String reponse, boolean closed){
        this.id = id;
        this.email = email;
        this.title = title;
        this.question = question;
        this.adminEmail = adminEmail;
        this.response = reponse;
        this.closed = closed;
    }

}
