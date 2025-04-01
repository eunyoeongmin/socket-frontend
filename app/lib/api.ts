import axios from 'axios';

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: 'http://localhost:7870', // 백엔드 서버 주소
});

// API 요청 함수 작성
export const getRooms = async () => {
  try {
    const response = await api.get('/api/rooms');
    return response.data;
  } catch (error) {
    console.error('방 목록 불러오기 실패:', error);
    return [];
  }
};

// export const createRoom = async (name: string) => {
//   try {
//     const response = await api.post('/api/rooms', { name });
//     return response.data;
//   } catch (error) {
//     console.error('방 생성 실패:', error);
//     throw error;
//   }
// };