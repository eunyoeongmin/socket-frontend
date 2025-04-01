'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { socket } from '../../lib/socket';

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

interface RoomCountUpdate {
  roomId: string;
  count: number;
}

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [userCount, setUserCount] = useState(0); // 현재 접속 인원 상태 추가
  const userId = Math.random(); // 실제 사용자 ID를 대체하세요

  useEffect(() => {
    // 방 입장 처리
    socket.emit('joinRoom', roomId);

    // 메시지 수신 리스너
    const handleMessage = (message: string, sender: string) => {
      setMessages(prev => [...prev, {
        text: message,
        sender,
        timestamp: new Date().toISOString()
      }]);
    };

    // 인원 수 업데이트 리스너
    const handleUserCount = ({ count }: RoomCountUpdate) => {
      setUserCount(count);
    };

    socket.on('messageReceived', handleMessage);
    socket.on('roomCountUpdated', handleUserCount);

    return () => {
      // 방 퇴장 처리
      socket.emit('leaveRoom', roomId);
      socket.off('messageReceived', handleMessage);
      socket.off('roomCountUpdated', handleUserCount);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (messageInput.trim()) {
      socket.emit('sendMessage', { roomId, message: messageInput, sender: userId });
      setMessageInput('');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">채팅방: {roomId}</h1>
        <p className="text-gray-600">현재 인원: {userCount}명</p> {/* 인원 표시 추가 */}
      </div>
      
      <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`mb-3 p-2 rounded-lg ${msg.sender === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
            style={{ maxWidth: '80%' }}
          >
            <div className="text-sm font-medium text-gray-700">{msg.sender}</div>
            <div className="text-gray-900">{msg.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="메시지를 입력하세요..."
          // onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          전송
        </button>
      </div>
    </div>
  );
}
