package com.example.LCProjectAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebMvc
public class CorsConfiguration implements WebMvcConfigurer {
    private final AuthenticationFilter authenticationFilter;

    @Autowired
    public CorsConfiguration(AuthenticationFilter authenticationFilter) {
        this.authenticationFilter = authenticationFilter;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationFilter)
                // Exclude intercepting requests to "/login" and "/register" endpoints
                .excludePathPatterns("/auth/login", "/auth/register", "/api/events","/api/admin/events");
    }



    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // Allow all origins (modify as needed)
                .allowedMethods("GET", "POST", "PUT", "DELETE" , "OPTIONS") // Allowed HTTP methods
                .allowedHeaders("*") // Allowed headers (modify as needed)
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/src/main/resources/images/") // Location of your images folder
                .addResourceLocations("/favicon.ico")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0); //disable caching for development
    }
}