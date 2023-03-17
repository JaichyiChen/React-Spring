package com.luv2read.springbootlibrary.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        //disable cross site request forgery
        http.csrf().disable();

        //protect endpoints at /api/<type>/secure
        http.authorizeHttpRequests(configure -> configure
                        .requestMatchers("/api/books/secure/**")
                        .authenticated())
                .oauth2ResourceServer()
                .jwt();

        //Add CORS filters
        //React application can pass security config
        http.cors();

        // Add content negotiation Strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        //Force a non-empty body for 401's to make response friendly
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }

}
