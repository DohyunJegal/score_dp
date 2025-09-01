'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';
import './data.css';

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
      
      // URL 업데이트 (히스토리에 추가하지 않음)
      const newUrl = `/data?iidxId=${encodeURIComponent(iidxId)}&level=${level}`;
      window.history.replaceState(null, '', newUrl);
      
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
    const levelParam = searchParams.get('level');
    
    if (iidxIdParam) {
      setIidxId(iidxIdParam);
      const targetLevel = levelParam ? parseInt(levelParam) : level;
      if (levels.includes(targetLevel)) {
        setLevel(targetLevel);
      }
      fetchData(iidxIdParam, targetLevel);
    }
  }, [searchParams]);

  const getClearColor = (clearLamp) => {
    const colorMap = {
      'NO_PLAY': '#999999',
      'FAILED': '#999999',
      'ASSIST_CLEAR': '#A185EA', 
      'EASY_CLEAR': '#88C94E',
      'CLEAR': '#99DFFF',
      'HARD_CLEAR': '#FF3200',
      'EX_HARD_CLEAR': '#F6EE52',
      'FULL_COMBO': '#33B4FF'
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
      {/* 데스크톱 헤더 */}
      <div className="hidden md:flex items-center justify-between mb-6">
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

      {/* 모바일 헤더 */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold mb-4">Player Data</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={iidxId}
            onChange={(e) => setIidxId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="IIDX ID (ex.7930-1798)"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-md hover:bg-gray-100 bg-gray-50 border border-gray-300"
          >
            검색
          </button>
        </div>
      </div>

      <div className="mb-6">
        {/* 데스크톱 레벨 선택 */}
        <div className="hidden md:flex justify-center gap-2">
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
        
        {/* 모바일 레벨 선택 (스크롤 가능) */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'fit-content' }}>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0 ${
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
              <div className="flex-1 grid grid-cols-3 md:grid-cols-6">
                {songs.map((song, index) => (
                  <div 
                    key={index} 
                    className={`song-item relative p-1 flex flex-col justify-between border border-gray-200 -ml-px -mt-px ${
                      song.difficulty === 'HYPER' ? 'song-item-hyper' : 
                      song.difficulty === 'LEGGENDARIA' ? 'song-item-leggendaria' : 'song-item-another'
                    } ${
                      song.userClearInfo?.hasPlayed && song.userClearInfo?.clearLamp ? 'clear-border' : 'no-clear-border'
                    }`}
                    style={{
                      borderRightColor: song.userClearInfo?.hasPlayed && song.userClearInfo?.clearLamp ? 
                        getClearColor(song.userClearInfo.clearLamp) : '#e5e7eb'
                    }}
                  >
                    <div className={`text-xs font-medium leading-tight break-words ${
                      song.versionNo === 32 ? 'song-title-current' : 'song-title-default'
                    }`}>
                      {song.title}{song.difficulty === 'LEGGENDARIA' ? '†' : ''}
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
