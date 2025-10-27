import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";
import EmailSetup from "./EmailSetup";
import DataRetrieval from "./DataRetrieval";
import ScrapedData from "./ScrapedData";
import RulesAutomation from "./RulesAutomation";
import ExportTable from "./ExportTable";
import MasterData from './MasterData';
import Suppliers from './Suppliers';
import UserManagement from './UserManagement';
import Account from './Account';

function DashboardLayout() {
  const [activeMenu, setActiveMenu] = useState("home"); // 👈 keys only

  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <MainContent />;
      case "emailSetup":
        return <EmailSetup />;
      case "dataRetrieval":
        return <DataRetrieval />;
      case "scrapedData":
        return <ScrapedData />;
      case "rulesAutomation":
        return <RulesAutomation />;
      case "masterData":
        return <MasterData setActiveMenu={setActiveMenu} />;
      case "suppliers":
        return <Suppliers />;
      case "export":
        return <ExportTable />;
      case "userManagement":
        return <UserManagement />;
      case "account":
        return <Account />;
      default:
        return <div className="p-6">🔍 Select a menu from Sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 overflow-y-auto">
        <Header activeMenu={activeMenu} /> {/* pass key */}
        {renderContent()}
      </div>
    </div>
  );
}

export default DashboardLayout;
