package com.restaurant.model;

import java.util.LinkedHashMap;
import java.util.Map;

public class Order {
    private Map<String, Integer> items; // itemName -> quantity
    private double subtotal;
    private double tax;
    private double total;
    private double serviceCharge;
    private double tip;
    
    public Order() {
        this.items = new LinkedHashMap<>();
    }
    
    public void addItem(String itemName, int quantity) {
        items.put(itemName, quantity);
    }
    
    public void removeItem(String itemName) {
        items.remove(itemName);
    }
    
    public void updateQuantity(String itemName, int quantity) {
        if (quantity <= 0) {
            items.remove(itemName);
        } else {
            items.put(itemName, quantity);
        }
    }
    
    public Map<String, Integer> getItems() { return items; }
    public void setItems(Map<String, Integer> items) { this.items = items; }
    
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    
    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }
    
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    
    public double getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(double serviceCharge) { this.serviceCharge = serviceCharge; }
    
    public double getTip() { return tip; }
    public void setTip(double tip) { this.tip = tip; }
}