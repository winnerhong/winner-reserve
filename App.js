import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, List, Plus, ChevronLeft, ChevronRight, LogOut, Clock, Building2, RotateCw, X, FileSpreadsheet } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- [Vercel 설정에서 넣은 환경변수를 불러옵니다] ---
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [appUser, setAppUser] = useState({ name: "홍보광 대표님", role: "admin" }); // 테스트용 로그인 유지
  const [viewMode, setViewMode] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. 데이터 가져오기
  const fetchReservations = async () => {
    setIsSyncing(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) setEvents(data);
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 2. 예약 저장하기
  const handleAddReservation = async (formData) => {
    const { error } = await supabase
      .from('reservations')
      .insert([{
        date: formData.date,
        time: `${formData.startTime}~${formData.endTime}`,
        center: formData.center,
        client_name: formData.clientName,
        type: formData.type,
        memo: formData.memo
      }]);

    if (error) {
      alert("저장 실패: " + error.message);
      return false;
    }
    fetchReservations();
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b-2 border-blue-600">
        <div className="flex items-center gap-2">
          <Building2 className="text-blue-600" />
          <h1 className="font-bold text-lg tracking-tighter">WINNER GROUP 통합예약</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-600">{appUser.name}</span>
          <button onClick={() => fetchReservations()} className="p-2 hover:bg-slate-100 rounded-full">
            <RotateCw size={20} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-blue-800 font-bold">현재 등록된 전체 예약</p>
            <p className="text-2xl font-black text-blue-600">{events.length}건</p>
          </div>
          <FileSpreadsheet className="text-blue-300" size={40} />
        </div>

        {/* 리스트 형태 예시 */}
        <div className="space-y-4">
          {events.map((e) => (
            <div key={e.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">{e.center}</span>
                <span className="text-slate-400 text-xs">{e.date}</span>
              </div>
              <h3 className="font-bold text-lg">{e.client_name} <span className="text-sm font-normal text-slate-500">| {e.type}</span></h3>
              <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                <Clock size={14} /> {e.time}
              </div>
              {e.memo && <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded italic">"{e.memo}"</p>}
            </div>
          ))}
          {events.length === 0 && <p className="text-center py-10 text-slate-400">등록된 예약이 없습니다.</p>}
        </div>
      </main>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Plus size={32} />
      </button>

      {/* 모달창 등 추가 UI 로직은 여기에... */}
    </div>
  );
}
