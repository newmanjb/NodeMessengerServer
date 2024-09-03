const defaultData =
    {
        contacts:
            [
                {
                    id: 0, contactDetails : {firstName: "Joshua", lastName: "Newman"}
                },
                {
                    id: 1, contactDetails : {firstName: "Billy", lastName: "Jimmun"}
                },
                {
                    id: 2, contactDetails : {firstName: "Clementine", lastName: "Flapcock"}
                },
                {
                    id: 3, contactDetails : {firstName: "Audrey", lastName: "Scrollard"}
                }
            ],
        conversations:
            [
                {
                    id: 1000, conversationDetails: {history: "J", draftedMessage: "J"}
                },
                {
                    id: 1001, conversationDetails: {history: "B", draftedMessage: "B"}
                },
                {
                    id: 1002, conversationDetails: {history: "C", draftedMessage: "C"}
                },
                {
                    id: 1003, conversationDetails: {history: "A", draftedMessage: "A"}
                }
            ]
    }

const { WebSocketServer } = require("ws")
const http = require("http")

const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8080
let connection = null;

const handleMessage = (bytes, uuid) => {
    const msgString = bytes.toString();
    console.log("received message", msgString);

    const msgJSON = JSON.parse(msgString)
    if(msgJSON.type === "RequestFullSnapshot") {
        connection.send(JSON.stringify(defaultData))
    }
}

const handleClose = () => {
    console.log(`disconnected`)
}

wsServer.on("connection", (connectionObj, request) => {
    console.log(`connected`)
    connection = connectionObj
    connection.on("message", (message) => handleMessage(message))
    connection.on("close", () => handleClose())
})

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`)
})

