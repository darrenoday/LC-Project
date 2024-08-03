package com.example.LCProjectAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class LcProjectApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LcProjectApiApplication.class, args);
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public WebMvcConfigurer webMvcConfigurer(AuthenticationFilter authenticationFilter) {
		return new WebMvcConfigurer() {
			@Override
			public void addInterceptors(InterceptorRegistry registry) {
				registry.addInterceptor(authenticationFilter)
						.excludePathPatterns("/auth/login", "/auth/register", "/auth/logout", "/auth/user", "/css");
			}

			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}

			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				// Serve static content from /static directory
				registry.addResourceHandler("/**")
						.addResourceLocations("classpath:/static/")
						.setCachePeriod(3600);

				// Optionally, add a handler for images if you need a specific path
				registry.addResourceHandler("/images/**")
						.addResourceLocations("classpath:/static/images/")
						.setCachePeriod(3600);

				// Serve favicon.ico from the static directory
				registry.addResourceHandler("/favicon.ico")
						.addResourceLocations("classpath:/static/")
						.setCachePeriod(3600);
			}
		};
	}
}
