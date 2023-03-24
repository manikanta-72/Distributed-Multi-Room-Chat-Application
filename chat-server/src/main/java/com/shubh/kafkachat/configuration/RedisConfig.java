package com.shubh.kafkachat.configuration;

//package com.baeldung.spring.data.redis.config;

import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericToStringSerializer;

@Configuration
@PropertySource("classpath:application.properties")
public class RedisConfig {

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        JedisConnectionFactory jedisConFactory;
        // = new JedisConnectionFactory();
        // jedisConFactory.setHostName("localhost");
        // jedisConFactory.setPort(6379);
        // return jedisConFactory;
        //return new JedisConnectionFactory();
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration("44.209.54.63", 6379);
        redisStandaloneConfiguration.setPassword("distributed");
        jedisConFactory = new JedisConnectionFactory(redisStandaloneConfiguration);
        return jedisConFactory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        final RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(jedisConnectionFactory());
        template.setValueSerializer(new GenericToStringSerializer<Object>(Object.class));
        System.out.println("redis connected ...");
        return template;
    }

}
