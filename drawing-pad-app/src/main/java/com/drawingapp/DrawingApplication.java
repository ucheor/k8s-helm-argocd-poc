package com.drawingapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class DrawingApplication extends SpringBootServletInitializer {
    public static void main(String[] args) {
        SpringApplication.run(DrawingApplication.class, args);
    }
}