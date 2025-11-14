import User from "./models/userModel.js"

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        // console.log(socket.id)
        socket.on('identity', async ({ userId }) => {
            console.log("user id", userId)
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                }, { new: true })
            } catch (error) {
                console.error('Error updating user on connect:', error);
            }
        })

        socket.on('updateLocation', async ({ longitude, latitude, userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    isOnline: true,
                    socketId: socket.id
                });

                if (user) {
                    io.emit("updateDeliveryLocation", {
                        deliveryBoyId: userId,
                        latitude, 
                        longitude
                    })
                }


            } catch (error) {
                console.log("updateDeliveryLocation Error :",error)
            }
        })

        socket.on('disconnect', async () => {
            try {
                await User.findOneAndUpdate(
                    { socketId: socket.id },
                    { isOnline: false, socketId: null }
                );
                console.log('User disconnected:', socket.id);
            } catch (error) {
                console.error('Error updating user on disconnect:', error);
            }
        });
    })
}