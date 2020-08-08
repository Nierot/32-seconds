module.exports = (socket, users) => {
    console.log(`User ${socket.id} connected`);
    users[socket.id] = {};
    console.log(users);

    socket.on('message', msg => {
        console.log(users);
    });

    socket.on('disconnect', msg => {
        console.log(`User ${socket.id} disconnected`);
        delete users[socket.id];
    });

    socket.on('new round', msg => {

    });
}