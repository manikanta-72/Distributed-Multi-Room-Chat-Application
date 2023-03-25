# Distributed-Multi-Room-Chat-Application
Chat applications have become a popular means of collaborating with people of different backgrounds. One such application that inspired us is Slack, where users discuss various topics from different domains. We designed a Chat application that has multiple rooms divided based on interests, and a user can join a particular room depending on their interests and contribute to the discussions. Although modern-day chat applications share images and videos in addition to text messages, we have restricted our application to support only text messages.

## System Overview
The following are the different components of our application:
1. User Interface: This component provides users with an interface to interact with others. At the receiver end, we need to ensure that total ordering is maintained. A user can perform the following functions:
  Join a group
  Send a message
  Receive a message 
2. Messaging Middleware: Our application utilizes a publish-subscribe communication architecture to relay messages from one user to another. In chat applications, a user typically performs both publishing and subscribing actions to various groups.
3. Persistent Storage: We have utilized persistent storage to store messages from multiple users in order to retrieve them on demand. This feature enables us to recover lost messages and retrieve old messages as needed by the user.

## System Architecture
![alt text](https://github.com/manikanta-72/Distributed-Multi-Room-Chat-Application/blob/main/design_image.png)
We distinguish users into two categories: online and offline users. Online users receive messages instantly, whereas offline users retrieve messages from persistent storage when they come back online.
Online users send their messages using RestAPI to the producer service hosted on the AWS cloud. The producer service then publishes the message to the Kafka server running on another AWS instance. This message is retrieved by the consumer service, which is subscribed and listening for the topic from the Kafka Server. End-users receive this message from the consumer service using websockets. The consumer service also writes information on Kafka events to the Redis database to store them for future use.
An offline user or an online user wanting to retrieve older messages will send a RestAPI request to the producer service, which in turn queries the Redis database and sends the retrieved messages back to the User Interface. Due to security concerns, we have moved the functionality of retrieving old messages directly from the Redis database to the producer service. This has helped limit the exposure of the database credentials to all users.

## Evaluation
Latency is one of the most important factors for any distributed application, as it measures the response time of the system. In our application, it refers to the delay between a message sent by a user and the message received by the online recipients. As our system involves message exchanges between 3 components, this delay may be caused by a variety of factors including network delays in UI-Producer service REST API calls, Kafka Server processing time, and UI-Backend processing time
$$Latency(l_i) = t_{ir} - t_{is}$$
$$Average Latency = \frac{1}{n} * \sum_i l_i $$
where $t_{ir}$ & $t_{is}$ is the received & sent time of the ith message respectively.
The below plot represents the latency accross 3 different client in 3 different Networks
![alt text](https://github.com/manikanta-72/Distributed-Multi-Room-Chat-Application/blob/main/latency%20(1).png)

Spaced-out Latency is a measure of the average latency (RTT) between sending and receiving messages by multiple recipients. In this case, a fixed number of messages is sent over evenly spaced, varying time spans.
The below plot represents the spaced-out latency accross 3 different client in 3 different Networks.
![alt text](https://github.com/manikanta-72/Distributed-Multi-Room-Chat-Application/blob/main/space_out_latency.png)

Throughput is another major factor for a distributed system as it calculates the capacity and performance of the system. Similar setting is used to test the throughput of the chat application. Throughput in this system is measured as the number of messages processed divided by the total time taken to process all the messages.
$$Throughput = \frac{N}{max(T_r) - min(T_s)}$$
where $T_r$ is the array of messages received timestamps, $T_s$ is the array of messages sent timestamps.
![alt text](https://github.com/manikanta-72/Distributed-Multi-Room-Chat-Application/blob/main/throughput.png)

