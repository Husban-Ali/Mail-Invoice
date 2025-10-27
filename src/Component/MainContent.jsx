import React from 'react';
import StatsCards from './StatsCards';
import ChartsSection from './ChartsSection';
import RecentInvoicesTable from './RecentInvoicesTable';
import TimeMetrics from './TimeMetrics';
import StatusCards from './StatusCards'; 
import Connect from './Connect';


function MainContent() {
  return (
    <div className="pt-1 px-6">
      <Connect />
      <StatsCards />
      <ChartsSection />
      <RecentInvoicesTable />
      <TimeMetrics />
      <StatusCards /> 
    </div>
  );
}

export default MainContent;

