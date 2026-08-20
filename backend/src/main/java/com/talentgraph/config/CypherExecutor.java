package com.talentgraph.config;

import org.neo4j.driver.*;
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

    public List<Record> execute(String cypher, Map<String, Object> params) {
        ExecutableQuery<EagerResult> query = driver.executableQuery(cypher)
                .withParameters(params);

        if (database != null && !database.trim().isEmpty()) {
            query = query.withConfig(QueryConfig.builder().withDatabase(database.trim()).build());
        }

        EagerResult result = query.execute();
        return result.records();
    }
}
