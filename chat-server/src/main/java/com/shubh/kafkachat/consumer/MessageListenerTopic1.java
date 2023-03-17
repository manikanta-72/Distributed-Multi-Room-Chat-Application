package com.shubh.kafkachat.consumer;

import com.shubh.kafkachat.constants.KafkaConstants;
import com.shubh.kafkachat.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageListenerTopic1 {
    @Autowired
    SimpMessagingTemplate template;

    @KafkaListener(
            topics = KafkaConstants.KAFKA_TOPIC,
            groupId = KafkaConstants.GROUP_ID_1,
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listen(Message message) {
        System.out.println("sending via kafka listener..");
        if(message.getTopic().equals(KafkaConstants.GROUP_ID_1) ){
            template.convertAndSend("/topic/group", message);
        }
    }
}
