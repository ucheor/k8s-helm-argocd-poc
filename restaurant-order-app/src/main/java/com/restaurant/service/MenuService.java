package com.restaurant.service;

import com.restaurant.model.MenuItem;
import java.util.*;

public class MenuService {
    private List<MenuItem> menuItems;
    
    public MenuService() {
        initializeMenu();
    }
    
    private void initializeMenu() {
        menuItems = Arrays.asList(
            // Starters
            new MenuItem("Garlic Bread", "Starter", 5.00),
            new MenuItem("Soup of the Day", "Starter", 6.50),
            
            // Main Courses
            new MenuItem("Grilled Chicken", "Main Course", 15.00),
            new MenuItem("Veggie Pasta", "Main Course", 13.50),
            new MenuItem("Beef Burger", "Main Course", 16.00),
            
            // Desserts
            new MenuItem("Chocolate Cake", "Dessert", 7.00),
            new MenuItem("Ice Cream", "Dessert", 5.50),
            
            // Drinks
            new MenuItem("Soft Drink", "Drink", 3.00),
            new MenuItem("Coffee", "Drink", 4.00),
            
            // Seasonal
            new MenuItem("Chef's Seasonal Dish", "Seasonal", 18.50)
        );
    }
    
    public List<MenuItem> getMenu() {
        return menuItems;
    }
    
    public MenuItem getMenuItemByName(String name) {
        return menuItems.stream()
            .filter(item -> item.getName().equalsIgnoreCase(name))
            .findFirst()
            .orElse(null);
    }
    
    public void displayMenu() {
        System.out.println("\n========== MENU ==========");
        System.out.println("\n🍴 Starters:");
        menuItems.stream()
            .filter(item -> item.getCategory().equals("Starter"))
            .forEach(item -> System.out.printf("  %-20s $%.2f\n", item.getName(), item.getPrice()));
        
        System.out.println("\n🍝 Main Courses:");
        menuItems.stream()
            .filter(item -> item.getCategory().equals("Main Course"))
            .forEach(item -> System.out.printf("  %-20s $%.2f\n", item.getName(), item.getPrice()));
        
        System.out.println("\n🍰 Desserts:");
        menuItems.stream()
            .filter(item -> item.getCategory().equals("Dessert"))
            .forEach(item -> System.out.printf("  %-20s $%.2f\n", item.getName(), item.getPrice()));
        
        System.out.println("\n🥤 Drinks:");
        menuItems.stream()
            .filter(item -> item.getCategory().equals("Drink"))
            .forEach(item -> System.out.printf("  %-20s $%.2f\n", item.getName(), item.getPrice()));
        
        System.out.println("\n🌱 Seasonal Special:");
        menuItems.stream()
            .filter(item -> item.getCategory().equals("Seasonal"))
            .forEach(item -> System.out.printf("  %-20s $%.2f\n", item.getName(), item.getPrice()));
        System.out.println("==========================\n");
    }
}