import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (server = import.meta.env.VITE_API_URL.replace("/api/", "")) => {


    // Sockets


    const socket = useMemo(() => io.connect(server), [server]);


    const [online, setOnline] = useState(false)


    useEffect(() => {

        setOnline(socket.connected)
        // console.log(socket, 'socket')

    }, [socket])

    useEffect(() => {

        socket.on('connect', () => {

            setOnline(true)

        })

    }, [socket])

    useEffect(() => {

        socket.on('disconnect', () => {

            setOnline(false)

        })

    }, [socket])

    return {

        socket,
        online
    }

}
