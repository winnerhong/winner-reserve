import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 수파베이스 연결 설정
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function App() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');
    
    if (error) {
      console.log('에러 발생:', error);
    } else {
      setReservations(data);
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>WINNER GROUP 통합예약</h1>
      <p style={{ fontSize: '18px' }}>
        현재 예약 시스템이 정상 작동 중입니다.
      </p>
      
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>예약 현황</h3>
        <p>등록된 예약: <strong>{reservations?.length || 0}</strong> 건</p>
      </div>
    </div>
  );
}

export default App;
