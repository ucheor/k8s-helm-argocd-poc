package com.drawingapp.api.models;

import java.time.LocalDateTime;

public class Drawing {
    private String id;
    private String name;
    private String dataUrl;
    private String format;
    private LocalDateTime createdDate;
    private int width;
    private int height;
    
    // Constructors
    public Drawing() {
        this.createdDate = LocalDateTime.now();
    }
    
    public Drawing(String name, String dataUrl, String format, int width, int height) {
        this();
        this.name = name;
        this.dataUrl = dataUrl;
        this.format = format;
        this.width = width;
        this.height = height;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDataUrl() {
        return dataUrl;
    }
    
    public void setDataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }
    
    public String getFormat() {
        return format;
    }
    
    public void setFormat(String format) {
        this.format = format;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    
    public int getWidth() {
        return width;
    }
    
    public void setWidth(int width) {
        this.width = width;
    }
    
    public int getHeight() {
        return height;
    }
    
    public void setHeight(int height) {
        this.height = height;
    }
}