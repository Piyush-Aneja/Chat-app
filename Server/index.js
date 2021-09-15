
const io = require("socket.io")(process.env.PORT, { cors: { origin: "*" } });

// var server = app.listen(process.env.PORT || 3001, function () {
//     console.log("server started");
// })
// const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", socket => {
    // socket.emit("new-user", socket.id);
    console.log("made socket connection");
    socket.broadcast.emit("add-id", socket.id);

    socket.on("chat", function (data, room) {

        // console.log(data);
        if (room === "")
            socket.broadcast.emit("chat", data);
        else
            socket.broadcast.to(room).emit("chat", data);
    });
    socket.on("typing", function (data, room) {

        if (room === "") {

            socket.broadcast.emit("typing", data);
        }
        else
            socket.to(room).emit("typing", data);
    });
    socket.on("joinroom", function (roomno) {
        console.log("joining room,", roomno);
        socket.join(roomno);
    });
    // let mySet = new Set();
    socket.on("get-ids", ((id) => {
        let arr = []

        socketDetails = io.sockets.sockets;
        socketDetails.forEach((it) => {
            arr.push(it["id"]);

        });

        io.to(socket.id).emit("receive-ids", arr);
    }));

    socket.on("disconnect", () => {
        io.sockets.emit("remove-id", socket.id);
    }
    );

});
