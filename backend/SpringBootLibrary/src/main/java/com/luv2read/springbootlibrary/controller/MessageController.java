package com.luv2read.springbootlibrary.controller;

import com.luv2read.springbootlibrary.entity.Message;
import com.luv2read.springbootlibrary.requestmodels.AdminQuestionRequest;
import com.luv2read.springbootlibrary.service.MessageService;
import com.luv2read.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value="Authorization") String token, @RequestBody Message messageRequest){

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        messageService.postMessage(messageRequest, userEmail);


    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader(value="Authorization") String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception{

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");

        //checking if current user sending the request is admin
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only.");
        }

        messageService.putMessage(adminQuestionRequest, userEmail);

    }

}
