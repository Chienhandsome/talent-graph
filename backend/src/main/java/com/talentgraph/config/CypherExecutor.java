package com.talentgraph.config;

import org.neo4j.driver.Driver;
import org.neo4j.driver.ExecutableQuery;
import org.neo4j.driver.QueryConfig;
import org.neo4j.driver.Record;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class CypherExecutor {

    private final Driver driver;
    private final String database;

    public CypherExecutor(Driver driver, @Value("${cognodb.database:}") String database) {
        this.driver = driver;
        this.database = database;
    }

    public List<Record> executeQuery(String cypher, Map<String, Object> params) {
        ExecutableQuery query = driver.executableQuery(cypher)
                .withParameters(params);

        if (database != null && !database.trim().isEmpty()) {
            query = query.withConfig(QueryConfig.builder().withDatabase(database.trim()).build());
        }

        return query.execute().records();
    }
}
