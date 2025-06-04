'use client';



import TeamList from '@/components/team/TeamList';

export default function TeamsPage() {
 
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Équipes</h1>     
        
        {/* La liste de toutes les équipes  de la plateforme*/}
        <TeamList 
      
        />
      </div>
    </div>
  );
}