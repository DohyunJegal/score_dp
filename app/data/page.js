'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';

function DataContent() {
  const [iidxId, setIidxId] = useState('');
  const [level, setLevel] = useState(12);
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

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
      // URL에서 파라미터 제거
      router.replace('/data', { scroll: false });
    }
  }, [searchParams, level, router]);

  const getClearColor = (clearLamp) => {
    const colorMap = {
      'NO_PLAY': '#999999',
      'FAILED': '#999999',
      'ASSIST_CLEAR': '#A185EA', 
      'EASY_CLEAR': '#88C94E',
      'CLEAR': '#91DBEA',
      'HARD_CLEAR': '#FF3200',
      'EX_HARD_CLEAR': '#F6EE52',
      'FULL_COMBO': '#73C2F1'
    };
    return colorMap[clearLamp] || '#999999';
  };

  const groupByPerceivedLevel = (songs) => {
    return songs.reduce((acc, song) => {
      let level = song.perceivedLevel || '미분류';
      // 정수인 경우 .0을 붙여서 표시
      if (typeof level === 'number' && level % 1 === 0) {
        level = level.toFixed(1);
      }
      if (!acc[level]) acc[level] = [];
      acc[level].push(song);
      return acc;
    }, {});
  };

  const groupedSongs = groupByPerceivedLevel(songData);


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
        <div className="space-y-4">
          {Object.entries(groupedSongs)
            .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
            .map(([perceivedLevel, songs]) => (
            <div key={perceivedLevel} className="flex border border-gray-200">
              <div className="bg-gray-800 text-white p-3 font-bold flex items-center justify-center min-w-[60px] text-center">
                {perceivedLevel}
              </div>
              <div className="flex-1 grid grid-cols-6">
                {songs.map((song, index) => (
                  <div 
                    key={index} 
                    className="relative p-1 flex flex-col justify-between bg-white border border-gray-200 -ml-px -mt-px"
                    style={{
                      borderRadius: 0,
                      boxSizing: 'border-box',
                      borderRightWidth: song.userClearInfo?.hasPlayed && song.userClearInfo?.clearLamp ? '8px' : '1px',
                      borderRightColor: song.userClearInfo?.hasPlayed && song.userClearInfo?.clearLamp ? 
                        getClearColor(song.userClearInfo.clearLamp) : '#e5e7eb'
                    }}
                    title={`Clear: ${song.userClearInfo?.clearLamp || 'None'}, HasPlayed: ${song.userClearInfo?.hasPlayed}`}
                  >
                    <div className="text-xs font-medium text-gray-800 leading-tight break-words">
                      {song.title}
                    </div>
                    {song.userClearInfo?.hasPlayed && (
                      <div className="text-xs text-gray-600">
                        {(() => {
                          const hasScore = song.userClearInfo.score > 0;
                          const hasValidDjLevel = song.userClearInfo.djLevel && song.userClearInfo.djLevel !== 'F';
                          
                          if (hasScore || hasValidDjLevel) {
                            return `${song.userClearInfo.djLevel || ''} (${song.userClearInfo.score || ''})`;
                          }
                          return ''; 
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Data() {
  return (
    <Suspense fallback={<Spinner message="페이지를 로딩하는 중..." />}>
      <DataContent />
    </Suspense>
  );
}
