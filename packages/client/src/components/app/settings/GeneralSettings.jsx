import React, { useState } from 'react';
import { useHospitalInfo } from '../../../contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';
import { updateHospitalInfo } from '../../../api/hospital';

const GeneralSettings = () => {
  const { hospitalInfo, setHospitalInfo } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [hospital, setHospital] = useState({ ...hospitalInfo });
  const [system, setSystem] = useState({ 
    notify: 'ON', 
    interval: 15, 
    emr: '사용',
    autoBackup: true,
    darkMode: false,
    language: 'ko',
    timezone: 'Asia/Seoul'
  });
  const [activeTab, setActiveTab] = useState('general');
  const [editQuickSettings, setEditQuickSettings] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', description: '', icon: '🔧', path: '', color: 'blue' });
  const navigate = useNavigate();

  // 기본 빠른 설정 카드들
  const [quickSettings, setQuickSettings] = useState([
    {
      id: 1,
      title: '병원 정보',
      description: '기본 정보 관리',
      icon: '🏥',
      path: '/Dashboard/hospital-info',
      color: 'blue'
    },
    {
      id: 2,
      title: '사용자 권한',
      description: '권한 및 역할 관리',
      icon: '👥',
      path: '/Dashboard/user-permissions',
      color: 'green'
    },
    {
      id: 3,
      title: '챗봇 설정',
      description: 'AI 챗봇 관리',
      icon: '🤖',
      path: '/Dashboard/chatbot-settings',
      color: 'purple'
    }
  ]);

  const saveHospitalInfo = async () => {
    try {
      await updateHospitalInfo(hospital);
      setHospitalInfo({ ...hospital });
      setEditMode(false);
      alert('병원 정보가 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    }
  };

  const cancelEdit = () => {
    setHospital({ ...hospitalInfo });
    setEditMode(false);
  };

  const saveSystemSettings = () => {
    // 시스템 설정 저장 로직
    alert('시스템 설정이 저장되었습니다.');
  };

  // 빠른 설정 편집 관련 함수들
  const handleEditQuickSettings = () => {
    setEditQuickSettings(!editQuickSettings);
    setShowAddCard(false);
  };

  const handleAddCard = () => {
    setShowAddCard(true);
    setNewCard({ title: '', description: '', icon: '🔧', path: '', color: 'blue' });
  };

  const handleSaveNewCard = () => {
    if (!newCard.title.trim() || !newCard.description.trim() || !newCard.path.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const cardToAdd = {
      id: Date.now(),
      title: newCard.title,
      description: newCard.description,
      icon: newCard.icon,
      path: newCard.path,
      color: newCard.color
    };

    setQuickSettings([...quickSettings, cardToAdd]);
    setShowAddCard(false);
    setNewCard({ title: '', description: '', icon: '🔧', path: '', color: 'blue' });
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setQuickSettings(quickSettings.filter(card => card.id !== id));
    }
  };

  const handleCardClick = (card) => {
    if (editQuickSettings) return; // 편집 모드에서는 클릭 무시
    navigate(card.path);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  const tabs = [
    { id: 'general', label: '기본 설정', icon: '⚙️' },
    { id: 'hospital', label: '병원 관리', icon: '🏥' },
    { id: 'users', label: '사용자 관리', icon: '👥' },
    { id: 'system', label: '시스템 설정', icon: '🔧' },
    { id: 'security', label: '보안 설정', icon: '🔒' },
    { id: 'backup', label: '백업/복원', icon: '💾' }
  ];

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">🎯 빠른 설정</h3>
          <div className="flex gap-2">
            {editQuickSettings && (
              <button
                onClick={handleAddCard}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                + 추가
              </button>
            )}
            <button
              onClick={handleEditQuickSettings}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                editQuickSettings 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {editQuickSettings ? '완료' : '편집'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickSettings.map((card) => (
            <div 
              key={card.id}
              className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-all ${
                editQuickSettings 
                  ? 'cursor-default' 
                  : 'hover:shadow-md cursor-pointer'
              } ${editQuickSettings ? 'relative' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              {editQuickSettings && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCard(card.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                  <span className="text-xl">{card.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{card.title}</h4>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* 새 카드 추가 폼 */}
          {showAddCard && (
            <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-300">
              <h4 className="font-medium text-gray-900 mb-3">새 카드 추가</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="제목"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="설명"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="아이콘 (이모지)"
                    value={newCard.icon}
                    onChange={(e) => setNewCard({ ...newCard, icon: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <select
                    value={newCard.color}
                    onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="blue">파랑</option>
                    <option value="green">초록</option>
                    <option value="purple">보라</option>
                    <option value="red">빨강</option>
                    <option value="yellow">노랑</option>
                    <option value="indigo">남색</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="경로 (예: /Dashboard/settings)"
                  value={newCard.path}
                  onChange={(e) => setNewCard({ ...newCard, path: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNewCard}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {editQuickSettings && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 편집 모드: 카드를 클릭하여 삭제하거나 "+ 추가" 버튼으로 새 카드를 만들 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHospitalTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">🏥 병원 정보 관리</h3>
        <p className="text-gray-600 mb-4">병원의 기본 정보를 관리합니다.</p>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/Dashboard/hospital-info')}
        >
          병원 정보 관리 페이지로 이동
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">📋 진료과 관리</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>보철과</span>
            <span className="text-green-600 text-sm">활성</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>교정과</span>
            <span className="text-green-600 text-sm">활성</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>치주과</span>
            <span className="text-green-600 text-sm">활성</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">👥 사용자 권한 관리</h3>
        <p className="text-gray-600 mb-4">사용자별 권한과 역할을 관리합니다.</p>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => navigate('/Dashboard/user-permissions')}
        >
          사용자 권한 관리 페이지로 이동
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">📊 사용자 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">전체 사용자</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">활성 사용자</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-gray-600">관리자</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">🔧 시스템 설정</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">알림 수신</label>
            <select
              value={system.notify}
              onChange={e => setSystem({ ...system, notify: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ON">ON</option>
              <option value="OFF">OFF</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">진료 예약 간격 (분)</label>
            <input
              type="number"
              value={system.interval}
              onChange={e => setSystem({ ...system, interval: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">EMR 연동</label>
            <select
              value={system.emr}
              onChange={e => setSystem({ ...system, emr: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="사용">사용</option>
              <option value="미사용">미사용</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">언어 설정</label>
            <select
              value={system.language}
              onChange={e => setSystem({ ...system, language: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">다크 모드</label>
              <p className="text-sm text-gray-500">어두운 테마 사용</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={system.darkMode}
                onChange={e => setSystem({ ...system, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">자동 백업</label>
              <p className="text-sm text-gray-500">매일 자동으로 데이터 백업</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={system.autoBackup}
                onChange={e => setSystem({ ...system, autoBackup: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <button
          onClick={saveSystemSettings}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          시스템 설정 저장
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">🔒 보안 설정</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">세션 타임아웃 (분)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">비밀번호 정책</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>기본 (8자 이상)</option>
              <option>강화 (12자 이상, 특수문자 포함)</option>
              <option>최강 (16자 이상, 대소문자+숫자+특수문자)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">2단계 인증</label>
              <p className="text-sm text-gray-500">SMS 또는 이메일 인증</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">IP 접근 제한</label>
              <p className="text-sm text-gray-500">허용된 IP에서만 접근</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          보안 설정 저장
        </button>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">💾 백업 및 복원</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">수동 백업</h4>
              <p className="text-sm text-blue-600 mb-3">지금 바로 데이터를 백업합니다.</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                백업 시작
              </button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">데이터 복원</h4>
              <p className="text-sm text-green-600 mb-3">백업된 데이터를 복원합니다.</p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                복원 시작
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">최근 백업 기록</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">2025-01-15 14:30:00</span>
                <span className="text-green-600 text-sm">완료</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">2025-01-14 14:30:00</span>
                <span className="text-green-600 text-sm">완료</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">2025-01-13 14:30:00</span>
                <span className="text-green-600 text-sm">완료</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'hospital': return renderHospitalTab();
      case 'users': return renderUsersTab();
      case 'system': return renderSystemTab();
      case 'security': return renderSecurityTab();
      case 'backup': return renderBackupTab();
      default: return renderGeneralTab();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">⚙️ 전체 설정</h2>
        <p className="text-gray-600 mt-1">시스템의 모든 설정을 관리합니다.</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GeneralSettings;
