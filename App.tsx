import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    "id": "1766216698492",
    "url": "https://paidandating2.pages.dev/",
    "title": "派单大厅",
    "timestamp": 1766216698492
  },
  {
    "id": "5",
    "url": "https://ludandating.pages.dev/",
    "title": "录单大厅",
    "timestamp": 1765770834252
  },
  {
    "id": "4",
    "url": "https://shouhouguanli.pages.dev/",
    "title": "售后管理",
    "timestamp": 1715000000000
  },
  {
    "id": "1766221507325",
    "url": "https://dingdanguanli2.pages.dev/",
    "title": "订单管理 ",
    "timestamp": 1766221507325
  },
  {
    "id": "1766202927722",
    "url": "https://xiangmuguanli.pages.dev/",
    "title": "项目管理",
    "timestamp": 1766202927722
  },
  {
    "id": "1766124456392",
    "url": "https://yemianbiaoge2.pages.dev/",
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

// Helper to clean titles
const cleanTitle = (title: string) => (title || '').replace(/页$/, '');

const PROJECT_MANAGEMENT_ITEMS = new Set([
  "地域项目价格", "地域项目价格页", "好评返现", "用户黑名单", "项目质保"
]);

const INDEPENDENT_ITEMS = new Set([
  "录单大厅", "售后管理", "售后管理页"
]);

// Type for Sidebar Nodes
type SidebarNode = NavItem | { type: 'group'; key: string; title: string; children: NavItem[] };

const App: React.FC = () => {
  const [items, setItems] = useState<NavItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("读取本地缓存失败", e);
    }
    return DEFAULT_DATA; 
  });

  const [activeUrl, setActiveUrl] = useState<string | null>(() => {
    if (Array.isArray(items) && items.length > 0) return items[0].url;
    return null;
  });

  useEffect(() => {
    if (!activeUrl && Array.isArray(items) && items.length > 0) {
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
  
  // Drag and Drop State
  const [sidebarOrder, setSidebarOrder] = useState<string[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const sortedSidebarNodes = useMemo<SidebarNode[]>(() => {
    if (!Array.isArray(items)) return [];
    
    const projectGroup: { type: 'group'; key: string; title: string; children: NavItem[] } = { 
      type: 'group', key: 'project_mgmt', title: '项目中心', children: [] 
    };
    
    const plainNodes: NavItem[] = [];

    items.forEach(item => {
      if (!item || !item.title) return;
      const t = cleanTitle(item.title).trim();
      
      if (PROJECT_MANAGEMENT_ITEMS.has(t)) {
        projectGroup.children.push(item);
      } else {
        plainNodes.push(item);
      }
    });

    const result: SidebarNode[] = [];
    if (projectGroup.children.length > 0) result.push(projectGroup);
    result.push(...plainNodes);

    if (sidebarOrder.length > 0) {
      result.sort((a, b) => {
        const keyA = ('key' in a) ? a.key : a.id;
        const keyB = ('key' in b) ? b.key : b.id;
        const indexA = sidebarOrder.indexOf(keyA);
        const indexB = sidebarOrder.indexOf(keyB);
        
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    return result;
  }, [items, sidebarOrder]);

  const onDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
    if (e.currentTarget instanceof HTMLElement) {
       e.currentTarget.style.opacity = "0.5";
    }
  };

  const onDragEnter = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    dragOverItem.current = position;
  };

  const onDragEnd = (e: React.DragEvent) => {
     if (e.currentTarget instanceof HTMLElement) {
       e.currentTarget.style.opacity = "1";
    }
    const dragIndex = dragItem.current;
    const dragOverIndex = dragOverItem.current;

    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const newNodes = [...sortedSidebarNodes];
      // Ensure indices are valid
      if(newNodes[dragIndex] && newNodes[dragOverIndex]) {
          const draggedItem = newNodes[dragIndex];
          newNodes.splice(dragIndex, 1);
          newNodes.splice(dragOverIndex, 0, draggedItem);
          
          const newOrder = newNodes.map(node => ('key' in node) ? node.key : node.id);
          setSidebarOrder(newOrder);
      }
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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
      // Check if local storage exists
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
          try {
              if(!Array.isArray(JSON.parse(local))) {
                  // If local storage is invalid (not array), load from server
                  const serverData = await fetchServerData();
                  if (serverData) setItems(serverData);
              }
          } catch(e) {
              const serverData = await fetchServerData();
              if (serverData) setItems(serverData);
          }
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

  const renderIcon = (title: string, sizeClass = "w-[17px] h-[17px]") => {
    const iconProps = { className: sizeClass, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" };
    const t = cleanTitle(title || '');
    if (t.includes('首页')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    if (t.includes('日报')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    if (t.includes('数据管理') || t.includes('项目')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
    if (t.includes('分析')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
    if (t.includes('店铺')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
    if (t.includes('订单')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    if (t.includes('师傅')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m12 6a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
    if (t.includes('权限')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
    if (t.includes('财务')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    if (t.includes('营销')) return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
    
    return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = activeUrl === item.url;
    return (
        <div 
            className={`group relative flex items-center ${isChild ? 'pl-8' : 'pl-3'} pr-2 py-2.5 hover:bg-white/5 transition-all duration-200 cursor-pointer ${isActive ? 'bg-blue-600/10 border-r-[3px] border-blue-500' : 'border-r-[3px] border-transparent'}`}
            onClick={() => setActiveUrl(item.url)}
        >
            <div className={`shrink-0 mr-3 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {renderIcon(item.title)}
            </div>
            <span className={`flex-1 truncate text-[13px] font-medium transition-colors ${isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {cleanTitle(item.title)}
            </span>

            {/* Hover Actions */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#001529]/90 backdrop-blur-sm rounded px-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item);
                    }}
                    className="p-1 text-slate-500 hover:text-blue-400 hover:bg-white/10 rounded transition-colors"
                    title="编辑"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('确定要删除此导航项吗？')) {
                            handleDeleteItem(item.id);
                        }
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                    title="删除"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
  };

  const renderSidebarContent = () => {
    return sortedSidebarNodes.map((node, index) => {
      if ('type' in node && node.type === 'group') {
        const isExpanded = expandedGroups.has(node.key);
        const hasActiveChild = node.children.some((child: NavItem) => child.url === activeUrl);
        return (
          <li 
            key={node.key} 
            className="border-b border-white/10 cursor-move"
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
             <button 
               onClick={() => toggleGroup(node.key)} 
               className={`w-full flex flex-row items-center justify-center text-center px-3 py-[10.5px] font-bold font-sans transition-all hover:bg-blue-800 ${hasActiveChild ? 'bg-blue-700 text-white' : 'text-white/90'}`}
             >
                <div className="shrink-0 mr-2">{renderIcon(node.title, "w-[17px] h-[17px]")}</div>
                <div className="flex items-center gap-1 overflow-hidden justify-center">
                    <span className="leading-tight text-[12.16px] truncate">{cleanTitle(node.title)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </div>
             </button>
             <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#0F172A] cursor-default ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="border-t border-white/5">{node.children.map((child: NavItem) => <li key={child.id}>{renderNavItem(child, true)}</li>)}</ul>
             </div>
          </li>
        );
      } else {
        const navItem = node as NavItem;
        return (
            <li
                key={navItem.id}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragEnter={(e) => onDragEnter(e, index)}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                className="cursor-move border-b border-white/10"
            >
                {renderNavItem(navItem)}
            </li>
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 font-sans">
        <header className="h-10 bg-slate-900 shadow-md shrink-0 z-30"></header>
        <div className="flex flex-1 overflow-hidden">
            <aside className="w-[122px] bg-[#001529] border-r border-white/10 flex flex-col shrink-0 z-20 transition-all duration-300">
                <div className="flex-1 overflow-y-auto custom-scrollbar"><ul className="py-0">{renderSidebarContent()}</ul></div>
                <div className="p-2 border-t border-white/10 bg-black/10 flex flex-col gap-2">
                    <button 
                        onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                        className="w-full flex flex-row items-center justify-center gap-2 py-1.5 bg-white/10 border border-white/20 text-white rounded text-[10.29px] font-sans hover:bg-blue-600 hover:border-blue-400 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span className="truncate">初始化模块</span>
                    </button>

                    <button onClick={handleResetToServer} className="w-full flex items-center justify-center gap-1 py-1.5 border border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>重置/刷新</span>
                    </button>

                    <button onClick={() => setIsExportModalOpen(true)} className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>生成部署配置</span>
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