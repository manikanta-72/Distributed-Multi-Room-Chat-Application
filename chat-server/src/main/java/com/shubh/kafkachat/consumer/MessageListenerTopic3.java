package com.shubh.kafkachat.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.shubh.kafkachat.constants.KafkaConstants;
import com.shubh.kafkachat.model.Message;

@Component
public class MessageListenerTopic3 {
    @Autowired
    SimpMessagingTemplate template;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @KafkaListener(
            topics = KafkaConstants.KAFKA_TOPIC3,
            groupId = KafkaConstants.GROUP_ID_1,
            containerFactory = "kafkaListenerContainerFactory3"
    )
    public void listen(Message message) {
        redisTemplate.opsForValue().set("topic3_test_message", message.toString());
        //System.out.println(redisTemplate.opsForValue().get("test_message1"));        
        System.out.println("sending via kafka listener..");
        template.convertAndSend("/topic/group", message);
    }
}
