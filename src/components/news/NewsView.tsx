import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewsArticle } from '../../types';
import {
  Newspaper,
  Calendar,
  Eye,
  PlusCircle,
  X,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Bell,
  Search,
} from 'lucide-react';

export const NewsView: React.FC<{
  selectedNews: NewsArticle | null;
  onSelectNews: (news: NewsArticle | null) => void;
}> = ({ selectedNews, onSelectNews }) => {
  const { news, currentUser, addNewsArticle } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for Admin
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('maintenance');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newPinned, setNewPinned] = useState(false);

  const categories = [
    { id: 'all', label: 'Tất cả tin tức' },
    { id: 'maintenance', label: 'Lịch bảo trì hệ thống' },
    { id: 'announcement', label: 'Thông báo chung' },
    { id: 'security', label: 'An toàn bảo mật' },
    { id: 'guide', label: 'Tin tức công nghệ' },
  ];

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());

    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const catObj = categories.find((c) => c.id === newCategory);

    addNewsArticle({
      title: newTitle,
      summary: newSummary || newContent.substring(0, 140) + '...',
      content: newContent,
      category: newCategory,
      categoryLabel: catObj ? catObj.label : 'Thông báo',
      author: currentUser ? currentUser.roleTitle : 'Trung tâm CNTT & Thư viện',
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pinned: newPinned,
      coverImage:
        newCover ||
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewCover('');
    setNewPinned(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-300 bg-white/10 px-3 py-1 rounded-full">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Thông tin & Bản tin CNTT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Bản Tin & Lịch Bảo Trì Hạ Tầng Kỹ Thuật</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Cập nhật thường xuyên các thông báo nâng cấp phần mềm, bản quyền, phòng chống tấn công mạng và kế hoạch bảo dưỡng định kỳ các phòng máy giảng đường.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start md:self-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng thông báo mới (Admin)</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm thông báo, lịch cắt điện bảo trì, đợt nâng cấp..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
                  filterCategory === c.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNews(item)}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            {item.coverImage && (
              <div className="h-44 overflow-hidden relative">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                  {item.categoryLabel}
                </div>
                {item.pinned && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Ghim đầu trang
                  </div>
                )}
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.publishedAt}</span>
                  <span>•</span>
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views} lượt xem</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium truncate max-w-[180px]">{item.author}</span>
                <span className="font-bold text-blue-600 group-hover:underline flex items-center space-x-1">
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-600 px-2.5 py-0.5 rounded-full font-medium">
                  {selectedNews.categoryLabel}
                </span>
                <span className="text-xs text-slate-300">Đăng lúc: {selectedNews.publishedAt}</span>
              </div>
              <button
                onClick={() => onSelectNews(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">{selectedNews.title}</h2>
                <div className="text-xs text-slate-500 mt-2 flex items-center space-x-4">
                  <span>Người đăng: <strong>{selectedNews.author}</strong></span>
                  <span>•</span>
                  <span>{selectedNews.views} lượt xem</span>
                </div>
              </div>

              {selectedNews.coverImage && (
                <img
                  src={selectedNews.coverImage}
                  alt={selectedNews.title}
                  className="w-full max-h-72 object-cover rounded-xl"
                />
              )}

              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedNews.content}
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
              <button
                onClick={() => onSelectNews(null)}
                className="px-4 py-2 bg-slate-800 text-white font-medium text-xs rounded-lg hover:bg-slate-900"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add News Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Đăng thông báo / Lịch bảo trì mới (Admin)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Thông báo bảo trì máy chủ LMS vào cuối tuần..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại thông báo:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                >
                  <option value="maintenance">Bảo trì hệ thống</option>
                  <option value="announcement">Thông báo chung</option>
                  <option value="security">An toàn bảo mật</option>
                  <option value="guide">Hướng dẫn công nghệ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đoạn tóm tắt ngắn:</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn để hiển thị ngoài trang chủ..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết thông báo:</label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Nhập toàn văn nội dung thông báo, thời gian, dịch vụ bị ảnh hưởng..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link ảnh minh họa (URL):</label>
                <input
                  type="text"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-700">Ghim thông báo này ở vị trí nổi bật nhất</span>
              </label>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
