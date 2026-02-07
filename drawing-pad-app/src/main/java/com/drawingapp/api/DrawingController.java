package com.drawingapp.api;

import com.drawingapp.api.models.Drawing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/drawings")
@CrossOrigin(origins = "*")
public class DrawingController {
    
    @Autowired
    private DrawingService drawingService;
    
    @PostMapping("/save")
    public ResponseEntity<?> saveDrawing(@RequestBody Drawing drawing) {
        try {
            // Validate data URL
            if (drawing.getDataUrl() == null || !drawing.getDataUrl().startsWith("data:image")) {
                return ResponseEntity.badRequest().body("Invalid image data");
            }
            
            Drawing savedDrawing = drawingService.saveDrawing(drawing);
            return ResponseEntity.ok(savedDrawing);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving drawing: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDrawing(@PathVariable String id) {
        Drawing drawing = drawingService.getDrawing(id);
        if (drawing == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(drawing);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Drawing>> getAllDrawings() {
        List<Drawing> drawings = drawingService.getAllDrawings();
        return ResponseEntity.ok(drawings);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDrawing(@PathVariable String id) {
        boolean deleted = drawingService.deleteDrawing(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAllDrawings() {
        drawingService.clearAllDrawings();
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new java.util.Date().toString());
        response.put("service", "Drawing Application");
        return ResponseEntity.ok(response);
    }
}