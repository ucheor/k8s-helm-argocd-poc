package com.restaurant.service;

import com.restaurant.model.MenuItem;
import com.restaurant.model.Order;
import java.util.Map;

public class BillingService {
    private MenuService menuService;
    
    public BillingService() {
        this.menuService = new MenuService();
    }
    
    public void calculateBill(Order order, double taxRate) {
        double subtotal = 0.0;
        
        // Calculate subtotal
        for (Map.Entry<String, Integer> entry : order.getItems().entrySet()) {
            MenuItem item = menuService.getMenuItemByName(entry.getKey());
            if (item != null) {
                subtotal += item.getPrice() * entry.getValue();
            }
        }
        
        order.setSubtotal(subtotal);
        
        // Calculate tax
        double tax = subtotal * (taxRate / 100);
        order.setTax(tax);
        
        // Calculate total
        double total = subtotal + tax;
        
        // Add service charge if applicable
        if (order.getServiceCharge() > 0) {
            double serviceCharge = subtotal * (order.getServiceCharge() / 100);
            total += serviceCharge;
        }
        
        // Add tip if applicable
        if (order.getTip() > 0) {
            total += order.getTip();
        }
        
        order.setTotal(total);
    }
}