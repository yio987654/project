package com.example;

import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;


@SpringBootApplication
public class BackendApplication {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
     
        log.info("yio test1"); 
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("yio test");
        try {
            Integer a =null;
            
            a.toString();
        } catch (Exception e) {
            log.error(e.toString()); 
        }
    }
}