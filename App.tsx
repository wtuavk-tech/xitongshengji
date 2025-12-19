import React, { useState, useEffect, useRef } from 'react';
import AddModal from './components/AddModal';
import ExportModal from './components/ExportModal';
import { NavItem } from './types';

// 本地存储的 Key
const STORAGE_KEY = 'sys_upgrade_nav_data_v1';

// 用户指定的固定数据
const DEFAULT_DATA: NavItem[] = [
  {
    "id": "home-nav",
    "url": "https://gerendaohang.pages.dev/",
    "title": "首页导航",
    "timestamp": 1715000000001
  },
  {
    "id": "1766124456392",
    "url": "https://gongzuoribao.pages.dev/",
    "title": "工作日报",
    "timestamp": 1766124456392
  },
  {
    "id": "1766127599481",
    "url": "https://shouyeguanli.pages.dev/",
    "title": "数据管理",
    "timestamp": 1766127599481
  },
  {
    "id": "1766124649937",
    "url": "https://disanfangdianpu.pages.dev/",
    "title": "第三方店铺",
    "timestamp": 1766124649937
  },
  {
    "id": "3",
    "url": "https://dingdanguanli1.pages.dev/",
    "title": "订单管理页",
    "timestamp": 1715000000000
  },
  {
    "id": "dispatcher",
    "url": "https://paidanyuan.pages.dev/",
    "title": "派单员页",
    "timestamp": 1715000000002
  },
  {
    "id": "4",
    "url": "https://shouhouguanli.pages.dev/",
    "title": "售后管理页",
    "timestamp": 1715000000000
  },
  {
    "id": "5",
    "url": "https://ludandating.pages.dev/",
    "title": "录单大厅",
    "timestamp": 1765770834252
  },
  {
    "id": "1765846048371",
    "url": "https://danku-59j.pages.dev/",
    "title": "单库页",
    "timestamp": 1765846048371
  },
  {
    "id": "1765938309622",
    "url": "https://dingdanshouku.pages.dev/",
    "title": "订单收款页",
    "timestamp": 1765938309622
  },
  {
    "id": "1765938335682",
    "url": "https://baocuodingdan.pages.dev/",
    "title": "报错订单页",
    "timestamp": 1765938335682
  },
  {
    "id": "1765938358648",
    "url": "https://zhipaidingdan1.pages.dev/",
    "title": "直派订单页",
    "timestamp": 1765938358648
  },
  {
    "id": "1765938389055",
    "url": "https://paidanyeji.pages.dev/",
    "title": "派单业绩",
    "timestamp": 1765938389055
  },
  {
    "id": "1765939188488",
    "url": "https://yuanshidingdan.pages.dev/",
    "title": "原始订单页",
    "timestamp": 1765939188488
  },
  {
    "id": "1765939498767",
    "url": "https://changqidingdan.pages.dev/",
    "title": "长期订单页",
    "timestamp": 1765939498767
  },
  {
    "id": "1765939589456",
    "url": "https://zhuanpaijilu.pages.dev/",
    "title": "转派记录页",
    "timestamp": 1765939589456
  },
  {
    "id": "1765940326326",
    "url": "https://paidanjilu.pages.dev/",
    "title": "派单记录页",
    "timestamp": 1765940326326
  },
  {
    "id": "1765941266543",
    "url": "https://diyuxiangmujiage.pages.dev/",
    "title": "地域项目价格页",
    "timestamp": 1765941266543
  },
  {
    "id": "1765941721016",
    "url": "https://haopingfanxian.pages.dev/",
    "title": "好评返现",
    "timestamp": 1765941721016
  },
  {
    "id": "1765941888712",
    "url": "https://ludanjiage.pages.dev/",
    "title": "录单价格页",
    "timestamp": 1765941888712
  },
  {
    "id": "1765943337256",
    "url": "https://yonghuheimingdan.pages.dev/",
    "title": "用户黑名单",
    "timestamp": 1765943337256
  },
  {
    "id": "1765950001916",
    "url": "https://baojiaye.pages.dev/",
    "title": "报价页",
    "timestamp": 1765950001916
  },
  {
    "id": "1765950938732",
    "url": "https://xiangmuzhibao.pages.dev/",
    "title": "项目质保",
    "timestamp": 1765950938732
  },
  {
    "id": "1765953857186",
    "url": "https://dairudanku.pages.dev/",
    "title": "待入单库",
    "timestamp": 1765953857186
  },
  {
    "id": "1765865340448",
    "url": "https://shifuluru.pages.dev/",
    "title": "师傅管理",
    "timestamp": 1765865340448
  },
  {
    "id": "1766025295066",
    "url": "https://quanxianguanli.pages.dev/",
    "title": "权限管理",
    "timestamp": 1766025295066
  },
  {
    "id": "1766106789892",
    "url": "https://caiwuguanli.pages.dev/",
    "title": "财务管理",
    "timestamp": 1766106789892
  },
  {
    "id": "1766127895281",
    "url": "https://yingxiaoguanli.pages.dev/",
    "title": "营销管理",
    "timestamp": 1766127895281
  }
];

const ORDER_MANAGEMENT_TITLES = new Set([
  "订单管理", "订单管理页",
  "录单大厅",
  "派单员页",
  "待入单库",
  "订单收款", "订单收款页",
  "报错订单", "报错订单页",
  "直排订单", "直派订单", "直派订单页",
  "派单业绩",
  "单库", "单库页",
  "原始订单", "原始订单页",
  "售后管理页", "售后管理",
  "长期订单", "长期订单页",
  "转派记录", "转派记录页",
  "派单记录", "派单记录页",
  "改单记录", "改单记录页",
  "地域项目价格", "地域项目价格页",
  "好评返现",
  "录单价格", "录单价格页",
  "用户黑名单",
  "报价", "报价页",
  "项目质保"
]);

const App: React.FC = () => {
  const [items, setItems] = useState<NavItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("读取本地缓存失败", e);
    }
    return DEFAULT_DATA; 
  });

  const [activeUrl, setActiveUrl] = useState<string | null>(() => {
    if (items && items.length > 0) return items[0].url;
    return null;
  });

  useEffect(() => {
    if (!activeUrl && items.length > 0) {
      setActiveUrl(items[0].url);
    }
  }, [items]);

  const [isLoading, setIsLoading] = useState(false);
  const hasLocalData = !!localStorage.getItem(STORAGE_KEY);
  const hasUserChanges = useRef(hasLocalData);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const fetchServerData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/nav-data.json?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.error("加载配置失败", e);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    const initData = async () => {
      if (localStorage.getItem(STORAGE_KEY)) {
        return;
      }
      const serverData = await fetchServerData();
      if (serverData) {
        setItems(serverData);
      }
    };
    initData();
  }, []);

  const persistChanges = (newItems: NavItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    hasUserChanges.current = true;
  };

  const handleResetToServer = async () => {
    if (window.confirm('确定要丢弃本地修改并恢复默认配置吗？')) {
      localStorage.removeItem(STORAGE_KEY);
      hasUserChanges.current = false;
      const serverData = await fetchServerData();
      if (serverData) {
        setItems(serverData);
      } else {
        setItems(DEFAULT_DATA);
      }
    }
  };

  const handleSaveItem = (url: string, title: string) => {
    let newItems;
    if (editingItem) {
      newItems = items.map(item => 
        item.id === editingItem.id ? { ...item, url, title } : item
      );
    } else {
      const newItem: NavItem = {
        id: Date.now().toString(),
        url,
        title,
        timestamp: Date.now(),
      };
      newItems = [...items, newItem];
    }
    persistChanges(newItems);
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    persistChanges(newItems);
    if (items.find(i => i.id === id)?.url === activeUrl) {
      if (newItems.length > 0) setActiveUrl(newItems[0].url);
      else setActiveUrl(null);
    }
  };

  const handleEditClick = (item: NavItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const renderIcon = (title: string, sizeClass = "w-6 h-6") => {
    const iconProps = { className: sizeClass, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" };
    if (title.includes('首页')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    if (title.includes('日报')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    if (title.includes('数据管理')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
    if (title.includes('分析')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
    if (title.includes('店铺')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
    if (title.includes('订单')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    if (title.includes('师傅')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m12 6a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
    if (title.includes('权限')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
    if (title.includes('财务')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    if (title.includes('营销')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
    
    return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  };

  const renderNavItem = (item: NavItem, isChild = false) => (
    <li key={item.id} className="relative group border-b border-white/10 last:border-0">
      <button
        onClick={() => setActiveUrl(item.url)}
        className={`w-full flex flex-col items-center justify-center text-center transition-all border-l-4 ${
          isChild ? 'py-[3px]' : 'py-[13.6px]'
        } ${
          activeUrl === item.url 
          ? 'border-blue-400 bg-blue-600 text-white' 
          : 'border-transparent text-white/80 hover:bg-blue-800 hover:text-white'
        }`}
      >
        <div className={isChild ? "mb-1" : "mb-2"}>
          {renderIcon(item.title, isChild ? "w-4 h-4" : "w-6 h-6")}
        </div>
        <div className={`px-2 leading-tight break-words font-sans ${isChild ? 'text-xs' : 'text-lg'}`} title={item.title}>
          {item.title}
        </div>
      </button>
      <div className={`absolute right-1 top-2 hidden group-hover:flex items-center gap-0.5 bg-black/30 backdrop-blur-sm rounded p-0.5 z-10`}>
        <button onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="p-1 text-white/50 hover:text-blue-300 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="p-1 text-white/50 hover:text-red-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>
    </li>
  );

  const renderSidebarContent = () => {
    const groupedStructure: (NavItem | { type: 'group'; key: string; title: string; children: NavItem[] })[] = [];
    const orderGroupChildren: NavItem[] = [];
    let orderGroupAdded = false;

    items.forEach(item => {
      if (ORDER_MANAGEMENT_TITLES.has(item.title)) {
        orderGroupChildren.push(item);
        if (!orderGroupAdded) {
          groupedStructure.push({
            type: 'group',
            key: 'group-order-management',
            title: '订单管理',
            children: orderGroupChildren
          });
          orderGroupAdded = true;
        }
      } else {
        groupedStructure.push(item);
      }
    });

    return groupedStructure.map(node => {
      if ('type' in node && node.type === 'group') {
        if (node.children.length === 0) return null;
        const isExpanded = expandedGroups.has(node.key);
        const hasActiveChild = node.children.some(child => child.url === activeUrl);
        return (
          <li key={node.key} className="border-b border-white/10">
             <button 
               onClick={() => toggleGroup(node.key)} 
               className={`w-full flex flex-col items-center justify-center text-center py-[13.6px] text-lg font-bold font-sans transition-all hover:bg-blue-800 ${hasActiveChild ? 'bg-blue-700 text-white' : 'text-white/90'}`}
             >
                <div className="mb-2">{renderIcon(node.title)}</div>
                <div className="flex items-center gap-1 justify-center px-2">
                    <span className="leading-tight">{node.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </div>
             </button>
             <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#0F172A] ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="border-t border-white/5">{node.children.map(child => renderNavItem(child, true))}</ul>
             </div>
          </li>
        );
      } else {
        return renderNavItem(node as NavItem);
      }
    });
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 font-sans">
        <header className="flex items-center justify-between px-4 bg-slate-900 text-white shrink-0 h-10 shadow-md z-30">
            <div className="font-bold text-sm tracking-wide truncate">急修到家系统升级优化</div>
            <div className="flex items-center gap-2">
                 <button onClick={handleResetToServer} className="flex items-center gap-1 px-2 py-1 border border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg><span>重置/刷新</span></button>
                 <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span>生成部署配置</span></button>
            </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
            <aside className="w-[122px] bg-[#001529] border-r border-white/10 flex flex-col shrink-0 z-20 transition-all duration-300">
                <div className="flex-1 overflow-y-auto custom-scrollbar"><ul className="py-0">{renderSidebarContent()}</ul></div>
                <div className="p-3 border-t border-white/10 bg-black/10">
                    <button 
                        onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                        className="w-full flex flex-col items-center justify-center gap-1 py-[8.5px] bg-white/10 border border-white/20 text-white rounded text-sm font-sans hover:bg-blue-600 hover:border-blue-400 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span className="truncate">初始化模块</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 relative bg-slate-100 h-full w-full">{activeUrl ? (<iframe src={activeUrl} className="absolute inset-0 w-full h-full border-none bg-white" title="Content Preview" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-presentation" />) : (<div className="flex items-center justify-center h-full text-gray-400"><p>请选择左侧导航项目</p></div>)}</main>
        </div>
        <AddModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSaveItem} initialValues={editingItem ? { title: editingItem.title, url: editingItem.url } : undefined} />
        <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} data={items} />
    </div>
  );
};

export default App;