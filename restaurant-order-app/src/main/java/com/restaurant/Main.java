package com.restaurant;

import com.restaurant.service.OrderService;

public class Main {
    public static void main(String[] args) {
        System.out.println("======================================");
        System.out.println("    RESTAURANT ORDERING SYSTEM");
        System.out.println("======================================");
        System.out.println("\nWelcome! Type 'menu' to see the menu");
        System.out.println("Type 'done' when finished ordering\n");
        
        OrderService orderService = new OrderService();
        orderService.startOrdering();
    }
}