package com.example.LCProjectAPI;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class AuthenticationFilter implements HandlerInterceptor {

    private static final List<String> whitelist = Arrays.asList(
            "/auth/register", "/auth/login", "/auth/logout", "/css", "/api/events","/api/admin/events","/contact"
    );

    private static boolean isWhitelisted(String path) {
        return whitelist.stream().anyMatch(path::startsWith);
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String requestURI = request.getRequestURI();
        if (isWhitelisted(requestURI)) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        try {
            response.getWriter().write("Unauthorized");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        response.getWriter().flush();
        return false;
    }
}
