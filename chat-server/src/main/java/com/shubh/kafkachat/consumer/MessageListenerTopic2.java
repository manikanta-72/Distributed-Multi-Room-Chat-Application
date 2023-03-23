package com.shubh.kafkachat.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shubh.kafkachat.constants.KafkaConstants;
import com.shubh.kafkachat.model.Message;

@Component
public class MessageListenerTopic2 {
    @Autowired
    SimpMessagingTemplate template;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    ObjectMapper mapper = new ObjectMapper();
    @KafkaListener(
            topics = KafkaConstants.KAFKA_TOPIC2,
            groupId = KafkaConstants.GROUP_ID_1,
            containerFactory = "kafkaListenerContainerFactory2"
    )
    public void listen(Message message) {
        int lastSeqNum = 0;
        if(redisTemplate.opsForValue().get("topic2_last_seq_num") != null){
            //System.out.println(redisTemplate.opsForValue().get("topic2_last_seq_num"));
            lastSeqNum = Integer.parseInt((String) redisTemplate.opsForValue().get("topic2_last_seq_num"));
        }
      
        int currentSeqNum = lastSeqNum + 1;
        String message_json = "";
        try {
            message_json = mapper.writeValueAsString(message);
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        redisTemplate.opsForValue().set("topic2_seq_" + Integer.toString(currentSeqNum), message_json);
        redisTemplate.opsForValue().set("topic2_last_seq_num", Integer.toString(currentSeqNum));
        //System.out.println(redisTemplate.opsForValue().get("topic2_last_seq_num"));       
        System.out.println("sending via kafka listener..");
        template.convertAndSend("/topic/group", message);
    }
}
