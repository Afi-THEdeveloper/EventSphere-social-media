import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../../components/User/SocketIo";
import toast from "react-hot-toast";

function VideoRoom() {
  const { roomId, userId } = useParams();
  const { event } = useSelector((state) => state.EventAuth);
  const zegoRef = useRef(null);

  useEffect(() => {
    const initZego = async () => {
      const appID = 1233385638;
      const serverSecret = "fec7eabfa53cd160df65d3526c1d65a6";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        event?.title
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: zegoRef.current,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomId,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: false,
        onJoinRoom: () => {
          socket.emit("videoCallInvite", {
            sender: event,
            meetlink:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomId,
            userId,
          });
        },
        onLeaveRoom: () => {
          window.history.back();
        },
      });

      // Save the Zego instance to the ref
      zegoRef.current = zp;
    };

    initZego();

    // Cleanup function
    return () => {
      window.location.reload();
    };
  }, [roomId, event?.title]);

  useEffect(() => {
    socket.on("videoCallResponse", (data) => {
      console.log('videoCallResponse',data);
      if (!data.accepted) {
       toast.error('call rejected by user',{duration:5000})
      }
    });
  
    return () => {
      socket.off("videoCallResponse");
    };
  }, []);

  return (
    <div className="flex-grow flex-shrink min-h-screen">
      <div ref={zegoRef} />
    </div>
  );
}

export default VideoRoom;
