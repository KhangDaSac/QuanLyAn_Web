import { useState } from 'react';
import LegalCaseTypeTab from '../component/case-data-manager/LegalCaseTypeTab';
import LegalRelationshipGroupTab from '../component/case-data-manager/LegalRelationshipGroupTab';
import LegalRelationshipTab from '../component/case-data-manager/LegalRelationshipTab';

type TabType = 'typeOfLegalCase' | 'legalRelationshipGroup' | 'legalRelationship';

const CaseDataManager = () => {
  const [activeTab, setActiveTab] = useState<TabType>('typeOfLegalCase');

  const tabs = [
    {
      id: 'typeOfLegalCase' as TabType,
      label: 'Loại vụ án',
      
    },
    {
      id: 'legalRelationshipGroup' as TabType,
      label: 'Nhóm quan hệ pháp luật',
      
    },
    {
      id: 'legalRelationship' as TabType,
      label: 'Quan hệ pháp luật',
    
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'typeOfLegalCase':
        return <LegalCaseTypeTab />;
      case 'legalRelationshipGroup':
        return <LegalRelationshipGroupTab />;
      case 'legalRelationship':
        return <LegalRelationshipTab />;
      default:
        return <LegalCaseTypeTab />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý thông tin án</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý các thông tin về loại vụ án, quan hệ pháp luật và nhóm quan hệ pháp luật</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CaseDataManager;
