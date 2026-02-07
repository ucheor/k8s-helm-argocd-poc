package com.restaurant.service;

import com.restaurant.model.MenuItem;
import com.restaurant.model.Order;
import java.util.Scanner;

public class OrderService {
    private MenuService menuService;
    private BillingService billingService;
    private Scanner scanner;
    
    public OrderService() {
        this.menuService = new MenuService();
        this.billingService = new BillingService();
        this.scanner = new Scanner(System.in);
    }
    
    public void startOrdering() {
        Order order = new Order();
        boolean ordering = true;
        
        menuService.displayMenu();
        
        while (ordering) {
            System.out.println("\nWhat would you like to order? (Enter item name or 'done' to finish)");
            System.out.print("Item: ");
            String input = scanner.nextLine().trim();
            
            if (input.equalsIgnoreCase("done")) {
                ordering = false;
                continue;
            }
            
            if (input.equalsIgnoreCase("menu")) {
                menuService.displayMenu();
                continue;
            }
            
            MenuItem selectedItem = menuService.getMenuItemByName(input);
            
            if (selectedItem == null) {
                System.out.println("Item not found. Please enter a valid item name.");
                continue;
            }
            
            int quantity = getValidQuantity(selectedItem.getName());
            
            if (quantity > 0) {
                order.updateQuantity(selectedItem.getName(), quantity);
                System.out.println(quantity + " x " + selectedItem.getName() + " added to your order.");
            } else {
                order.removeItem(selectedItem.getName());
                System.out.println(selectedItem.getName() + " removed from your order.");
            }
            
            // Display current order
            displayCurrentOrder(order);
        }
        
        // Ask for additional charges
        askForAdditionalCharges(order);
        
        // Calculate final bill
        billingService.calculateBill(order, 13.0); // 13% tax
        
        // Print receipt
        ReceiptPrinter.printReceipt(order);
        
        scanner.close();
    }
    
    private int getValidQuantity(String itemName) {
        while (true) {
            System.out.print("Quantity (0-3, 0 to remove): ");
            try {
                int quantity = Integer.parseInt(scanner.nextLine().trim());
                if (quantity >= 0 && quantity <= 3) {
                    return quantity;
                } else {
                    System.out.println("Please enter a number between 0 and 3.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }
    
    private void displayCurrentOrder(Order order) {
        if (order.getItems().isEmpty()) {
            System.out.println("\nYour order is currently empty.");
        } else {
            System.out.println("\nCurrent Order:");
            System.out.println("-------------------");
            order.getItems().forEach((item, qty) -> {
                MenuItem menuItem = menuService.getMenuItemByName(item);
                if (menuItem != null) {
                    System.out.printf("%s x%d - $%.2f\n", item, qty, menuItem.getPrice() * qty);
                }
            });
            System.out.println("-------------------");
        }
    }
    
    private void askForAdditionalCharges(Order order) {
        System.out.print("\nAdd service charge? (y/n): ");
        String serviceChargeInput = scanner.nextLine().trim().toLowerCase();
        
        if (serviceChargeInput.equals("y")) {
            System.out.print("Service charge percentage (e.g., 10 for 10%): ");
            try {
                double servicePercent = Double.parseDouble(scanner.nextLine().trim());
                order.setServiceCharge(servicePercent);
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. No service charge added.");
            }
        }
        
        System.out.print("\nAdd tip? (y/n): ");
        String tipInput = scanner.nextLine().trim().toLowerCase();
        
        if (tipInput.equals("y")) {
            System.out.print("Tip amount (in dollars): ");
            try {
                double tipAmount = Double.parseDouble(scanner.nextLine().trim());
                order.setTip(tipAmount);
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. No tip added.");
            }
        }
    }
}