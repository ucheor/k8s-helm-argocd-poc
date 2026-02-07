package com.moodjournal;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@WebServlet("/")
public class MoodJournalServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
        InputStream is = getServletContext().getResourceAsStream("/WEB-INF/index.html");
        if (is == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "index.html not found");
            return;
        }
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(is, StandardCharsets.UTF_8))) {
            
            String line;
            while ((line = reader.readLine()) != null) {
                response.getWriter().println(line);
            }
        } catch (IOException e) {
            throw new ServletException("Error reading index.html", e);
        }
    }
}

// package com.moodjournal;

// import javax.servlet.ServletException;
// import javax.servlet.annotation.WebServlet;
// import javax.servlet.http.HttpServlet;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;
// import java.io.IOException;

// @WebServlet("/")
// public class MoodJournalServlet extends HttpServlet {
    
//     @Override
//     protected void doGet(HttpServletRequest request, HttpServletResponse response) 
//             throws ServletException, IOException {
//         response.setContentType("text/html");
//         request.getRequestDispatcher("/WEB-INF/index.html").forward(request, response);
//     }
// }

