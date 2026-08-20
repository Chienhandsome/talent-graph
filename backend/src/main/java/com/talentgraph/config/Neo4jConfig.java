package com.talentgraph.config;

import jakarta.annotation.PreDestroy;
import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Config;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class Neo4jConfig {

    @Value("${cognodb.uri}")
    private String uri;

    @Value("${cognodb.username}")
    private String username;

    @Value("${cognodb.password}")
    private String password;

    private Driver driver;

    @Bean
    public Driver driver() {
        this.driver = GraphDatabase.driver(
                uri,
                AuthTokens.basic(username, password),
                Config.builder()
                        .withMaxConnectionPoolSize(10)
                        .withConnectionAcquisitionTimeout(10, TimeUnit.SECONDS)
                        .withMaxConnectionLifetime(30, TimeUnit.MINUTES)
                        .build()
        );
        return this.driver;
    }

    @PreDestroy
    public void close() {
        if (driver != null) {
            driver.close();
        }
    }
}
