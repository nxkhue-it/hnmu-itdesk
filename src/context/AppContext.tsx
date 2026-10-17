import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Ticket,
  NewsArticle,
  KnowledgeArticle,
  TicketStatus,
  UserRole,
  DeviceAsset,
  CampusRoom,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_TICKETS,
  INITIAL_NEWS,
  INITIAL_KNOWLEDGE_BASE,
  INITIAL_ROOMS,
  INITIAL_DEVICES,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUser: (userIdOrRole: string) => void;
  isLoggedIn: boolean;

  // Authentication
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data Stores
  tickets: Ticket[];
  news: NewsArticle[];
  knowledgeBase: KnowledgeArticle[];
  users: User[];
  rooms: CampusRoom[];
  devices: DeviceAsset[];

  // Navigation
  activeTab: 'home' | 'tickets' | 'knowledge' | 'news' | 'dashboard' | 'assistant';
  setActiveTab: (tab: 'home' | 'tickets' | 'knowledge' | 'news' | 'dashboard' | 'assistant') => void;
  adminSubTab: 'overview' | 'tickets' | 'users' | 'rooms' | 'devices';
  setAdminSubTab: (tab: 'overview' | 'tickets' | 'users' | 'rooms' | 'devices') => void;

  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;

  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;

  createTicket: (data: {
    title: string;
    description: string;
    category: any;
    urgency: any;
    campus: string;
    building: string;
    room: string;
    deviceCode?: string;
  }) => string;

  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, note?: string, parts?: string[]) => void;
  assignTicket: (ticketId: string, technicianId: string) => void;
  addTicketComment: (ticketId: string, content: string, isInternal?: boolean) => void;
  rateTicket: (ticketId: string, score: number, feedback: string) => void;

  // Knowledge base interactions
  markHelpful: (articleId: string) => void;

  // Admin CMS actions
  addNewsArticle: (article: Omit<NewsArticle, 'id' | 'views'>) => void;
  addKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'views' | 'helpfulCount'>) => void;

  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUserRole: (userId: string, newRole: UserRole, newTitle: string) => void;
  toggleUserStatus: (userId: string) => void;

  // Room Management
  addRoom: (room: Omit<CampusRoom, 'id'>) => void;
  updateRoom: (roomId: string, data: Partial<CampusRoom>) => void;
  deleteRoom: (roomId: string) => void;

  // Device Management
  addDevice: (device: Omit<DeviceAsset, 'id'>) => void;
  updateDevice: (deviceId: string, data: Partial<DeviceAsset>) => void;
  deleteDevice: (deviceId: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'uniit_current_user_v3',
  USERS: 'uniit_users_list_v2',
  TICKETS: 'uniit_tickets_v2',
  NEWS: 'uniit_news_v2',
  KB: 'uniit_kb_v2',
  ROOMS: 'uniit_rooms_v2',
  DEVICES: 'uniit_devices_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Mặc định khởi chạy là Khách vãng lai (Chưa đăng nhập)
    return null;
  });

  const [rooms, setRooms] = useState<CampusRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ROOMS;
  });

  const [devices, setDevices] = useState<DeviceAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEVICES;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TICKETS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NEWS;
  });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KB);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_KNOWLEDGE_BASE;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'knowledge' | 'news' | 'dashboard' | 'assistant'>('home');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'tickets' | 'users' | 'rooms' | 'devices'>('overview');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.error(e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    } catch (e) {
      console.error(e);
    }
  }, [devices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.error(e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.error(e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KB, JSON.stringify(knowledgeBase));
    } catch (e) {
      console.error(e);
    }
  }, [knowledgeBase]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const login = (email: string, password?: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser) {
      showToast('Không tìm thấy tài khoản với email này trong hệ thống.');
      return false;
    }

    if (foundUser.status === 'locked') {
      showToast('Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Quản trị viên TT CNTT.');
      return false;
    }

    if (password && foundUser.password && password !== foundUser.password && password !== 'password123') {
      showToast('Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin đăng nhập.');
      return false;
    }

    const updatedUser: User = {
      ...foundUser,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setIsLoginModalOpen(false);
    showToast(`Đăng nhập thành công! Xin chào ${updatedUser.name} (${updatedUser.roleTitle})`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Đã đăng xuất khỏi hệ thống.');
  };

  const switchUser = (userIdOrRole: string) => {
    if (userIdOrRole === 'guest') {
      setCurrentUser(null);
      showToast('Đã chuyển sang chế độ Khách (Chưa đăng nhập).');
      return;
    }
    const found = users.find((u) => u.id === userIdOrRole || u.role === userIdOrRole);
    if (found) {
      setCurrentUser(found);
      showToast(`Đã chuyển vai trò: ${found.name} (${found.roleTitle})`);
    }
  };

  const createTicket = (data: {
    title: string;
    description: string;
    category: any;
    urgency: any;
    campus: string;
    building: string;
    room: string;
    deviceCode?: string;
  }): string => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      showToast('Vui lòng đăng nhập để gửi yêu cầu hỗ trợ.');
      return '';
    }

    const codeNumber = Math.floor(100 + Math.random() * 900);
    const newCode = `TK-2026-${codeNumber}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const slaMinutes =
      data.urgency === 'critical' ? 15 : data.urgency === 'high' ? 60 : data.urgency === 'normal' ? 240 : 720;

    const newTicket: Ticket = {
      id: `tk-${Date.now()}`,
      code: newCode,
      title: data.title,
      description: data.description,
      category: data.category,
      urgency: data.urgency,
      status: 'pending',
      campus: data.campus,
      building: data.building,
      room: data.room,
      deviceCode: data.deviceCode || undefined,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRoleTitle: currentUser.roleTitle,
      requesterEmail: currentUser.email,
      requesterPhone: currentUser.phone,
      requesterDepartment: currentUser.department,
      createdAt: now,
      updatedAt: now,
      slaDeadlineMinutes: slaMinutes,
      activities: [
        {
          id: `act-${Date.now()}`,
          timestamp: now,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          content: `Đã khởi tạo yêu cầu hỗ trợ ${newCode} với mức độ ưu tiên: ${data.urgency.toUpperCase()}.`,
          type: 'status_change',
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Đã tạo thành công phiếu ${newCode}! Đội ngũ kỹ thuật sẽ tiếp nhận ngay.`);
    return newTicket.id;
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, note?: string, parts?: string[]) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const author = currentUser || { name: 'Hệ thống IT', role: 'admin' as UserRole };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const newActivities = [...t.activities];
        const statusLabels: Record<TicketStatus, string> = {
          pending: 'Chờ tiếp nhận',
          assigned: 'Đã phân công',
          in_progress: 'Đang xử lý',
          waiting_parts: 'Chờ linh kiện / chờ phản hồi',
          resolved: 'Đã hoàn thành',
          closed: 'Đã nghiệm thu & đóng',
        };

        let content = `Trạng thái phiếu chuyển thành: ${statusLabels[newStatus]}.`;
        if (note) {
          content += `\nGhi chú: ${note}`;
        }

        newActivities.push({
          id: `act-${Date.now()}`,
          timestamp: now,
          authorName: author.name,
          authorRole: author.role,
          content,
          type: newStatus === 'resolved' ? 'resolution' : 'status_change',
        });

        const updated: Ticket = {
          ...t,
          status: newStatus,
          updatedAt: now,
          resolvedAt: newStatus === 'resolved' || newStatus === 'closed' ? (t.resolvedAt || now) : t.resolvedAt,
          replacementParts: parts && parts.length > 0 ? parts : t.replacementParts,
          activities: newActivities,
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      })
    );

    showToast('Đã cập nhật trạng thái phiếu hỗ trợ.');
  };

  const assignTicket = (ticketId: string, technicianId: string) => {
    const technician = users.find((u) => u.id === technicianId);
    if (!technician) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const author = currentUser || { name: 'Quản trị viên', role: 'admin' as UserRole };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const newActivities = [
          ...t.activities,
          {
            id: `act-${Date.now()}`,
            timestamp: now,
            authorName: author.name,
            authorRole: author.role,
            content: `Đã phân công phiếu cho kỹ thuật viên: ${technician.name} (${technician.phone}).`,
            type: 'assignment' as const,
          },
        ];

        const updated: Ticket = {
          ...t,
          assignedTechnicianId: technician.id,
          assignedTechnicianName: technician.name,
          assignedTechnicianPhone: technician.phone,
          status: t.status === 'pending' ? 'assigned' : t.status,
          updatedAt: now,
          activities: newActivities,
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      })
    );

    showToast(`Đã phân công cho kỹ thuật viên ${technician.name}.`);
  };

  const addTicketComment = (ticketId: string, content: string, isInternal: boolean = false) => {
    if (!content.trim()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const author = currentUser || { name: 'Khách vãng lai', role: 'guest' as UserRole };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const newActivities = [
          ...t.activities,
          {
            id: `act-${Date.now()}`,
            timestamp: now,
            authorName: author.name,
            authorRole: author.role,
            content: content.trim(),
            type: 'comment' as const,
            isInternal,
          },
        ];

        const updated: Ticket = {
          ...t,
          updatedAt: now,
          activities: newActivities,
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      })
    );

    showToast('Đã gửi trao đổi/ghi chú thành công.');
  };

  const rateTicket = (ticketId: string, score: number, feedback: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const newActivities = [
          ...t.activities,
          {
            id: `act-${Date.now()}`,
            timestamp: now,
            authorName: currentUser?.name || 'Người yêu cầu',
            authorRole: currentUser?.role || 'lecturer',
            content: `Đã nghiệm thu đánh giá chất lượng phục vụ: ${score}/5 sao. Nhận xét: "${feedback || 'Hài lòng'}".`,
            type: 'rating' as const,
          },
        ];

        const updated: Ticket = {
          ...t,
          status: 'closed',
          updatedAt: now,
          rating: {
            score,
            feedback,
            ratedAt: now,
          },
          activities: newActivities,
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      })
    );

    showToast(`Cảm ơn bạn đã đánh giá ${score} sao cho dịch vụ hỗ trợ!`);
  };

  const markHelpful = (articleId: string) => {
    setKnowledgeBase((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, helpfulCount: a.helpfulCount + 1 } : a))
    );
    showToast('Cảm ơn bạn đã bình chọn bài viết hữu ích!');
  };

  const addNewsArticle = (articleData: Omit<NewsArticle, 'id' | 'views'>) => {
    const newArticle: NewsArticle = {
      ...articleData,
      id: `news-${Date.now()}`,
      views: 1,
    };
    setNews((prev) => [newArticle, ...prev]);
    showToast('Đã đăng bài viết tin tức mới thành công.');
  };

  const addKnowledgeArticle = (data: Omit<KnowledgeArticle, 'id' | 'views' | 'helpfulCount'>) => {
    const newArticle: KnowledgeArticle = {
      ...data,
      id: `kb-${Date.now()}`,
      views: 1,
      helpfulCount: 0,
    };
    setKnowledgeBase((prev) => [newArticle, ...prev]);
    showToast('Đã thêm bài hướng dẫn kỹ thuật mới vào cơ sở tri thức.');
  };

  // User Management
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Đã tạo tài khoản cho: ${newUser.name} (${newUser.email})`);
  };

  const updateUserRole = (userId: string, newRole: UserRole, newTitle: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, roleTitle: newTitle } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole, roleTitle: newTitle } : null));
    }
    showToast('Đã cập nhật phân quyền người dùng thành công.');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newStatus = u.status === 'locked' ? 'active' : 'locked';
        showToast(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản: ${u.name}`);
        return { ...u, status: newStatus };
      })
    );
  };

  // Room Management
  const addRoom = (roomData: Omit<CampusRoom, 'id'>) => {
    const newRoom: CampusRoom = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
    showToast(`Đã thêm phòng học mới: ${newRoom.name} (${newRoom.building})`);
  };

  const updateRoom = (roomId: string, data: Partial<CampusRoom>) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...data } : r)));
    showToast('Đã cập nhật thông tin phòng học thành công.');
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    showToast('Đã xóa phòng học khỏi danh mục quản lý.');
  };

  // Device Management
  const addDevice = (deviceData: Omit<DeviceAsset, 'id'>) => {
    const newDevice: DeviceAsset = {
      ...deviceData,
      id: `dev-${Date.now()}`,
    };
    setDevices((prev) => [newDevice, ...prev]);
    showToast(`Đã bổ sung thiết bị ${newDevice.code} - ${newDevice.name} vào kho tài sản.`);
  };

  const updateDevice = (deviceId: string, data: Partial<DeviceAsset>) => {
    setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, ...data } : d)));
    showToast('Đã cập nhật thông tin thiết bị và lịch sử bảo dưỡng.');
  };

  const deleteDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    showToast('Đã xóa thiết bị khỏi hệ thống.');
  };

  const resetToDefaults = () => {
    setTickets(INITIAL_TICKETS);
    setNews(INITIAL_NEWS);
    setKnowledgeBase(INITIAL_KNOWLEDGE_BASE);
    setUsers(DEMO_USERS);
    setRooms(INITIAL_ROOMS);
    setDevices(INITIAL_DEVICES);
    setCurrentUser(null);
    localStorage.clear();
    showToast('Đã khôi phục toàn bộ cơ sở dữ liệu và chuyển về chế độ Khách vãng lai ban đầu.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        isLoggedIn: !!currentUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        logout,
        tickets,
        news,
        knowledgeBase,
        users,
        rooms,
        devices,
        activeTab,
        setActiveTab,
        adminSubTab,
        setAdminSubTab,
        selectedTicket,
        setSelectedTicket,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createTicket,
        updateTicketStatus,
        assignTicket,
        addTicketComment,
        rateTicket,
        markHelpful,
        addNewsArticle,
        addKnowledgeArticle,
        addUser,
        updateUserRole,
        toggleUserStatus,
        addRoom,
        updateRoom,
        deleteRoom,
        addDevice,
        updateDevice,
        deleteDevice,
        toastMessage,
        showToast,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
