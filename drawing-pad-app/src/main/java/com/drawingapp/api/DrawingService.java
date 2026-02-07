package com.drawingapp.api;

import com.drawingapp.api.models.Drawing;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DrawingService {
    private final Map<String, Drawing> drawings = new ConcurrentHashMap<>();
    
    public Drawing saveDrawing(Drawing drawing) {
        String id = UUID.randomUUID().toString();
        drawing.setId(id);
        drawings.put(id, drawing);
        return drawing;
    }
    
    public Drawing getDrawing(String id) {
        return drawings.get(id);
    }
    
    public List<Drawing> getAllDrawings() {
        return new ArrayList<>(drawings.values());
    }
    
    public boolean deleteDrawing(String id) {
        return drawings.remove(id) != null;
    }
    
    public void clearAllDrawings() {
        drawings.clear();
    }
}