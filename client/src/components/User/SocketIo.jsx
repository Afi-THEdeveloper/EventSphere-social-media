import socketIOClient from "socket.io-client";
import { API_BASE_URL } from "../../config/api";

const socket = socketIOClient(API_BASE_URL);

export default socket;
