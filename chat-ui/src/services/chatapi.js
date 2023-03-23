import Axios from "axios";

const api = Axios.create({
    baseURL: '/api/',
});

const chatAPI = {
    getMessages: (topic, offset=0) => {
        console.log('Calling get messages from API');
        return api.get(`message?topic=${topic}&offset=${offset}`);
    },

    sendMessage: (username, text, topic) => {
        let msg = {
            sender: username,
            content: text,
            topic: topic,
            timestamp: Date.now()
        }
        return api.post(`message`, msg);
    }
}


export default chatAPI;
