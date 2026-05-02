interface TabsProps {
  tabs: string[];
  activeTab: string;
  onSelect: (tab: string) => void;
}

const Tabs = ({ tabs, activeTab, onSelect }: TabsProps) => (
  <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Fandom filter">
    {tabs.map((tab) => (
      <button
        key={tab}
        role="tab"
        aria-selected={activeTab === tab}
        onClick={() => onSelect(tab)}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
          activeTab === tab
            ? 'bg-[#ad93e6] text-white'
            : 'bg-[rgba(173,147,230,0.12)] text-[#ad93e6] hover:bg-[rgba(173,147,230,0.25)]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default Tabs;
