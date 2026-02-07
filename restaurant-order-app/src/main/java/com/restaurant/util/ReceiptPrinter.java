package com.restaurant.util;

import com.restaurant.model.MenuItem;
import com.restaurant.model.Order;
import com.restaurant.service.MenuService;
import java.util.Map;

public class ReceiptPrinter {
    private static final int LINE_LENGTH = 38;
    private static final String RESTAURANT_NAME = "GOURMET DELIGHT";
    
    public static void printReceipt(Order order) {
        MenuService menuService = new MenuService();
        
        System.out.println("\n\n");
        printLine();
        System.out.println(centerText(RESTAURANT_NAME));
        printLine();
        
        // Print items
        for (Map.Entry<String, Integer> entry : order.getItems().entrySet()) {
            MenuItem item = menuService.getMenuItemByName(entry.getKey());
            if (item != null && entry.getValue() > 0) {
                double lineTotal = item.getPrice() * entry.getValue();
                String itemLine = String.format("%-20s x%-2d  $%6.2f", 
                    item.getName(), entry.getValue(), lineTotal);
                System.out.println(itemLine);
            }
        }
        
        printLine();
        
        // Print subtotal
        System.out.printf("%-28s $%6.2f\n", "Subtotal", order.getSubtotal());
        
        // Print tax
        System.out.printf("%-28s $%6.2f\n", "Tax (13%)", order.getTax());
        
        // Print service charge if applicable
        if (order.getServiceCharge() > 0) {
            System.out.printf("%-28s $%6.2f\n", 
                String.format("Service Charge (%.1f%%)", order.getServiceCharge()),
                order.getSubtotal() * (order.getServiceCharge() / 100));
        }
        
        // Print tip if applicable
        if (order.getTip() > 0) {
            System.out.printf("%-28s $%6.2f\n", "Tip", order.getTip());
        }
        
        printLine();
        
        // Print total
        System.out.printf("%-28s $%6.2f\n", "TOTAL", order.getTotal());
        
        printLine();
        System.out.println(centerText("Thank you for your order!"));
        printLine();
    }
    
    private static void printLine() {
        System.out.println("-".repeat(LINE_LENGTH));
    }
    
    private static String centerText(String text) {
        int padding = (LINE_LENGTH - text.length()) / 2;
        return " ".repeat(Math.max(0, padding)) + text;
    }
}