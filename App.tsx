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
    "id": "1765941888712",
    "url": "https://ludanjiage.pages.dev/",
    "title": "录单价格页",
    "timestamp": 1765941888712
  },
  {
    "id": "1765950001916",
    "url": "https://baojiaye.pages.dev/",
    "title": "报价页",
    "timestamp": 1765950001916
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
  },
  {
    "id": "1766202927722",
    "url": "https://xiangmuguanli.pages.dev/",
    "title": "项目管理",
    "timestamp": 1766202927722
  }
];

// Helper to clean titles
const cleanTitle = (title: string) => title.replace(/页$/, '');

const ORDER_MANAGEMENT_ITEMS = new Set([
  "派单员页", "待入单库", "订单收款页", "报错订单页", "直派订单页", 
  "派单业绩", "单库页", "原始订单页", "长期订单页", "转派记录页", 
  "派单记录页", "录单价格页", "报价页", "订单管理页", "订单管理", 
  "订单收款", "报错订单", "直排订单", "直派订单", "单库", 
  "原始订单", "长期订单", "转派记录", "派单记录", "改单记录", "改单记录页", 
  "录单价格", "报价"
]);

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
  
  // Drag and Drop State
  const [sidebarOrder, setSidebarOrder] = useState<string[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

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

  const renderIcon = (title: string, sizeClass = "w-[17px] h-[17px]") => {
    const iconProps = { className: sizeClass, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" };
    const t = cleanTitle(title);
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

  const renderNavItem = (item: NavItem, isChild = false) => (
    <li key={item.id} className="relative group border-b border-white/10 last:border-0">
      <button
        onClick={() => setActiveUrl(item.url)}
        className={`w-full flex flex-row items-center justify-start text-left px-3 transition-all border-l-4 py-[10.5px] ${
          activeUrl === item.url 
          ? 'border-blue-400 bg-blue-600 text-white' 
          : 'border-transparent text-white/80 hover:bg-blue-800 hover:text-white'
        }`}
      >
        <div className="shrink-0 mr-2">
          {renderIcon(item.title, isChild ? "w-[11px] h-[11px]" : "w-[17px] h-[17px]")}
        </div>
        <div className={`leading-tight font-sans truncate ${isChild ? 'text-[11.44px]' : 'text-[12.16px]'}`} title={item.title}>
          {cleanTitle(item.title)}
        </div>
      </button>
      <div className={`absolute right-1 top-1 hidden group-hover:flex items-center gap-0.5 bg-black/30 backdrop-blur-sm rounded p-0.5 z-10`}>
        <button onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="p-0.5 text-white/50 hover:text-blue-300 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="p-0.5 text-white/50 hover:text-red-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>
    </li>
  );

  // Function to generate the node structure based on data (categorization logic)
  const getSidebarNodes = () => {
    // Categorize items
    const earlyIds = ["home-nav", "1766124456392", "1766127599481", "1766124649937"];
    const lateIds = ["1765865340448", "1766025295066", "1766106789892", "1766127895281"];
    
    const orderChildren = items.filter(i => ORDER_MANAGEMENT_ITEMS.has(i.title));
    const projectChildren = items.filter(i => PROJECT_MANAGEMENT_ITEMS.has(i.title));
    const luDanItem = items.find(i => i.title === "录单大厅");
    const shouHouItem = items.find(i => INDEPENDENT_ITEMS.has(i.title) && i.title.includes("售后"));

    const nodes: SidebarNode[] = [];

    // Early Top Levels
    earlyIds.forEach(id => {
        const it = items.find(i => i.id === id);
        if (it) nodes.push(it);
    });

    // Order Group
    if (orderChildren.length > 0) {
        nodes.push({ type: 'group', key: 'g-order', title: '订单管理', children: orderChildren });
    }

    // Extracted Independent Items
    if (luDanItem) nodes.push(luDanItem);
    if (shouHouItem) nodes.push(shouHouItem);

    // Project Group 1 (Restored and positioned after After-sales)
    if (projectChildren.length > 0) {
        nodes.push({ type: 'group', key: 'g-project', title: '项目管理1', children: projectChildren });
    }

    // Late Top Levels
    lateIds.forEach(id => {
        const it = items.find(i => i.id === id);
        if (it) nodes.push(it);
    });

    // Handle any items not explicitly categorized
    const knownIds = new Set([...earlyIds, ...lateIds, ...(luDanItem ? [luDanItem.id] : []), ...(shouHouItem ? [shouHouItem.id] : [])]);
    items.forEach(it => {
        if (!knownIds.has(it.id) && !ORDER_MANAGEMENT_ITEMS.has(it.title) && !PROJECT_MANAGEMENT_ITEMS.has(it.title)) {
            nodes.push(it);
        }
    });
    
    return nodes;
  };

  const sidebarNodes = getSidebarNodes();

  // Sync sidebarOrder with generated nodes
  useEffect(() => {
    if (sidebarNodes.length === 0) return;

    setSidebarOrder(prev => {
        const newKeys = sidebarNodes.map(n => ('type' in n ? n.key : n.id));
        const keptKeys = prev.filter(k => newKeys.includes(k));
        const keptKeysSet = new Set(keptKeys);
        const addedKeys = newKeys.filter(k => !keptKeysSet.has(k));
        
        const finalOrder = [...keptKeys, ...addedKeys];
        
        if (JSON.stringify(finalOrder) !== JSON.stringify(prev)) {
            return finalOrder;
        }
        return prev;
    });
  }, [items]); // Update when items/nodes change

  // Sort nodes based on sidebarOrder
  const sortedSidebarNodes = [...sidebarNodes].sort((a, b) => {
      const keyA = 'type' in a ? a.key : a.id;
      const keyB = 'type' in b ? b.key : b.id;
      const indexA = sidebarOrder.indexOf(keyA);
      const indexB = sidebarOrder.indexOf(keyB);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
  });

  const onDragStart = (e: React.DragEvent, index: number) => {
      dragItem.current = index;
      e.currentTarget.style.opacity = "0.5";
      e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnter = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragItem.current === null) return;
      if (dragItem.current === index) return;

      const newOrder = [...sidebarOrder];
      // We are sorting based on the rendered index, but sidebarOrder holds keys.
      // Need to map rendered index back to keys to perform the swap correctly in the order array.
      
      const draggedNode = sortedSidebarNodes[dragItem.current];
      const targetNode = sortedSidebarNodes[index];
      
      const draggedKey = 'type' in draggedNode ? draggedNode.key : draggedNode.id;
      const targetKey = 'type' in targetNode ? targetNode.key : targetNode.id;

      const currentDraggedIndexInOrder = newOrder.indexOf(draggedKey);
      const currentTargetIndexInOrder = newOrder.indexOf(targetKey);

      if (currentDraggedIndexInOrder !== -1 && currentTargetIndexInOrder !== -1) {
          newOrder.splice(currentDraggedIndexInOrder, 1);
          newOrder.splice(currentTargetIndexInOrder, 0, draggedKey);
          setSidebarOrder(newOrder);
          dragItem.current = index;
      }
  };

  const onDragEnd = (e: React.DragEvent) => {
      e.currentTarget.style.opacity = "1";
      dragItem.current = null;
  };
  
  const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
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
               className={`w-full flex flex-row items-center justify-start text-left px-3 py-[10.5px] font-bold font-sans transition-all hover:bg-blue-800 ${hasActiveChild ? 'bg-blue-700 text-white' : 'text-white/90'}`}
             >
                <div className="shrink-0 mr-2">{renderIcon(node.title, "w-[17px] h-[17px]")}</div>
                <div className="flex items-center gap-1 overflow-hidden">
                    <span className="leading-tight text-[12.16px] truncate">{cleanTitle(node.title)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </div>
             </button>
             <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#0F172A] cursor-default ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="border-t border-white/5">{node.children.map((child: NavItem) => renderNavItem(child, true))}</ul>
             </div>
          </li>
        );
      } else {
        const navItem = node as NavItem;
        return (
            <div
                key={navItem.id}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragEnter={(e) => onDragEnter(e, index)}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                className="cursor-move"
            >
                {renderNavItem(navItem)}
            </div>
        );
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
                <div className="p-2 border-t border-white/10 bg-black/10">
                    <button 
                        onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                        className="w-full flex flex-row items-center justify-center gap-2 py-1.5 bg-white/10 border border-white/20 text-white rounded text-[10.29px] font-sans hover:bg-blue-600 hover:border-blue-400 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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