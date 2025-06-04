import React from 'react';

const TeamTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'info', label: 'Informations' },
    { id: 'players', label: 'Joueurs' },
    { id: 'matches', label: 'Matchs' },
    { id: 'competitions', label: 'Compétitions' },
    { id: 'standings', label: 'performances' }
  ];

  return (
    <div className="border-b">
      <nav className="flex overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TeamTabs;