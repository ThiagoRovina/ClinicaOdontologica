package com.sistemaClinica.ClinicaOdont;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.sistemaClinica")
@EntityScan(basePackages = "com.sistemaClinica")
@EnableJpaRepositories(basePackages = "com.sistemaClinica")
public class ClinicaOdontApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicaOdontApplication.class, args);
    }

}
