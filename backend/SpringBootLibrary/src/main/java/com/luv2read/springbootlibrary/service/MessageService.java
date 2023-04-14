package com.luv2read.springbootlibrary.service;

import com.luv2read.springbootlibrary.dao.MessageRepository;
import com.luv2read.springbootlibrary.entity.Message;
import com.luv2read.springbootlibrary.requestmodels.AdminQuestionRequest;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository){
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail){
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());

        message.setUserEmail(userEmail);

        messageRepository.save(message);
    }

    //Admin put route for responding to questions
    //userEmail in this case is the admin email
    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception{
        //find the corresponding question in db
        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());

        if(!message.isPresent()){
            throw new Exception("Message not found");
        }
        //add adminEmail, add response and close the question
        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);

        messageRepository.save(message.get());
    }

}
