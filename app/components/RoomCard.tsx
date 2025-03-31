import React from 'react';
import Link from 'next/link';

interface RoomCardProps {
  room: {
    roomId: string;
    name: string;
    participants: string[];
    participantCount: number;
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{room.name}</h3>
      <p className="text-gray-600 mb-2">참가자: {room.participantCount}명</p>
      <Link href={`/chat/${room.roomId}`}>
        <p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          입장하기
        </p>
      </Link>
    </div>
  );
};

export default RoomCard;