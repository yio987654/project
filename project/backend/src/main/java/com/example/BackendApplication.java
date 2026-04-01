package com.example;

import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;


@SpringBootApplication
public class BackendApplication {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        log.info("后端应用启动中..."); 
        SpringApplication.run(BackendApplication.class, args);
        log.info("后端应用已成功启动!");
    }
}