import { useState } from 'react';
import TypeOfLegalCaseTab from '../component/case-data-manager/TypeOfLegalCaseTab';
import LegalRelationshipGroupTab from '../component/case-data-manager/LegalRelationshipGroupTab';
import LegalRelationshipTab from '../component/case-data-manager/LegalRelationshipTab';

type TabType = 'typeOfLegalCase' | 'legalRelationshipGroup' | 'legalRelationship';

const CaseDataManager = () => {
  const [activeTab, setActiveTab] = useState<TabType>('typeOfLegalCase');

  const tabs = [
    {
      id: 'typeOfLegalCase' as TabType,
      label: 'Loại vụ án',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'legalRelationshipGroup' as TabType,
      label: 'Nhóm quan hệ pháp luật',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'legalRelationship' as TabType,
      label: 'Quan hệ pháp luật',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'typeOfLegalCase':
        return <TypeOfLegalCaseTab />;
      case 'legalRelationshipGroup':
        return <LegalRelationshipGroupTab />;
      case 'legalRelationship':
        return <LegalRelationshipTab />;
      default:
        return <TypeOfLegalCaseTab />;
    }
  };

  const getActiveTabInfo = () => {
    return tabs.find(tab => tab.id === activeTab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 md:mb-8 overflow-hidden">
          <div className='p-6'>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý thông tin án</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý các thông tin về loại vụ án, quan hệ pháp luật và nhóm quan hệ pháp luật</p>
            </div>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 md:mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh mục quản lý</h3>
          </div>
          <div className="p-2">
            <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-4 inline-flex items-center justify-center space-x-3 rounded-lg font-medium ${activeTab === tab.id
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  <div className={`${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
                    {tab.icon}
                  </div>
                  <div className="text-center">
                    <span className="block">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-red-600">
                {getActiveTabInfo()?.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getActiveTabInfo()?.label}</h3>
              </div>
            </div>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDataManager;
