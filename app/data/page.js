'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Spinner from '../components/Spinner';

export default function Data() {
  const [iidxId, setIidxId] = useState('');
  const [level, setLevel] = useState(12);
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  const levels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const fetchData = async (iidxId, level) => {
    if (!iidxId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/data/${iidxId}/${level}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // API 응답에서 songs 배열 추출
      setSongData(data.songs || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (iidxId.trim()) {
      fetchData(iidxId.trim(), level);
    }
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    if (iidxId.trim()) {
      fetchData(iidxId.trim(), newLevel);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const iidxIdParam = searchParams.get('iidxId');
    if (iidxIdParam) {
      setIidxId(iidxIdParam);
      fetchData(iidxIdParam, level);
    }
  }, [searchParams, level]);


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Player Data</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={iidxId}
            onChange={(e) => setIidxId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="IIDX ID (ex.7930-1798)"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-md hover:bg-gray-100"
          >
            검색
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-center gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              className={`px-4 py-2 rounded-md ${
                level === lvl 
                  ? 'font-semibold underline underline-offset-4 decoration-1' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              ☆{lvl}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center py-8">
          <div className="text-gray-600">정보가 없습니다.</div>
        </div>
      )}

      {loading && <Spinner message="데이터를 가져오는 중..." />}
      
      {!loading && songData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white overflow-hidden">
            <thead className="border-t border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">체감 난이도</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">곡명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">점수</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">클리어</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">DJ LEVEL</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">BP</th>
              </tr>
            </thead>
            <tbody>
              {songData.map((song, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{song.perceivedLevel || '미분류'}</td>
                  <td className="px-4 py-3 text-gray-700">{song.title}</td>
                  <td className="px-4 py-3 text-gray-700">{song.userClearInfo?.score || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{song.userClearInfo?.clearLamp || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{song.userClearInfo?.djLevel || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{song.userClearInfo?.pgreat || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
