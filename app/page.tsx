'use client';
import { useEffect, useState } from 'react';
import { socket } from './lib/socket';
import RoomCard from './components/RoomCard';
import { getRooms } from './lib/api';

interface ChatRoom {
  roomId: string;
  name: string;
  participants: string[];
  participantCount: number;
}

export default function LobbyPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getRooms();
      setRooms(data);
    };

    fetchRooms();
    socket.on('roomCreated', (newRoom: ChatRoom) => {
      setRooms(prev => [...prev, newRoom]);
    });

    return () => {
      socket.off('roomCreated');
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      socket.emit('createRoom', newRoomName); // WebSocket 이벤트 발신
    } catch (error) {
      console.error('방 생성 오류:', error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">채팅방 목록</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="새 방 이름"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          방 만들기
        </button>
      </div>
      <div className="space-y-4">
        {rooms.map(room => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
    </div>
  );
}