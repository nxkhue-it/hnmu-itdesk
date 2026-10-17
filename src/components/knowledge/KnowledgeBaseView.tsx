import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KnowledgeArticle } from '../../types';
import {
  Search,
  BookOpen,
  Wifi,
  Laptop,
  Mail,
  GraduationCap,
  Shield,
  ThumbsUp,
  Eye,
  PlusCircle,
  X,
  CheckCircle2,
  Lightbulb,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC<{
  selectedArticle: KnowledgeArticle | null;
  onSelectArticle: (article: KnowledgeArticle | null) => void;
}> = ({ selectedArticle, onSelectArticle }) => {
  const { knowledgeBase, markHelpful, currentUser, addKnowledgeArticle } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Article Form state (Admin)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('wifi_network');
  const [newSummary, setNewSummary] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [newTips, setNewTips] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả danh mục' },
    { id: 'wifi_network', label: 'Mạng & Wi-Fi' },
    { id: 'classroom_av', label: 'Thiết bị Giảng đường' },
    { id: 'software', label: 'Phần mềm & Ứng dụng' },
    { id: 'office_email', label: 'Tài khoản & Email' },
    { id: 'lms_elearning', label: 'E-Learning & Đào tạo' },
    { id: 'security', label: 'An toàn Bảo mật' },
  ];

  const filteredArticles = knowledgeBase.filter((item) => {
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const catObj = categories.find((c) => c.id === newCategory);
    const stepsArray = newSteps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const tipsArray = newTips
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addKnowledgeArticle({
      title: newTitle,
      category: newCategory,
      categoryLabel: catObj ? catObj.label : 'Hướng dẫn',
      summary: newSummary,
      steps: stepsArray.length > 0 ? stepsArray : ['Bước 1: Kiểm tra cấu hình hệ thống.'],
      tips: tipsArray,
      tags: tagsArray.length > 0 ? tagsArray : ['HuongDan', 'CNTT'],
      updatedAt: new Date().toISOString().split('T')[0],
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewSteps('');
    setNewTips('');
    setNewTags('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 text-xs text-blue-200 bg-white/10 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kho tri thức kỹ thuật số hóa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Sổ Tay Hướng Dẫn & Tự Khắc Phục Sự Cố CNTT</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Tổng hợp quy trình cấu hình Wi-Fi, phần mềm thi, giải quyết lỗi máy chiếu và tài khoản phục vụ cán bộ, giảng viên và sinh viên trường.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start md:self-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng bài hướng dẫn mới (Admin)</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết hướng dẫn theo tiêu đề, từ khóa, hiện tượng lỗi..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Xóa
              </button>
            )}
          </div>

          {selectedTag && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2.5 py-1.5 rounded-lg shrink-0">
              <Tag className="w-3.5 h-3.5" />
              <span>Tag: #{selectedTag}</span>
              <button onClick={() => setSelectedTag(null)} className="ml-1 font-bold text-blue-900">
                ×
              </button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">Không tìm thấy bài viết nào phù hợp với từ khóa.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedTag(null);
              }}
              className="mt-3 text-xs text-blue-600 underline font-semibold"
            >
              Hiển thị lại toàn bộ danh sách
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    {article.categoryLabel}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{article.helpfulCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{article.views}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{article.summary}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag);
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cập nhật: {article.updatedAt}</span>
                  <span className="text-blue-600 font-bold flex items-center space-x-1 group-hover:underline">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                  {selectedArticle.categoryLabel}
                </span>
                <span className="text-xs text-blue-200">Cập nhật: {selectedArticle.updatedAt}</span>
              </div>
              <button
                onClick={() => onSelectArticle(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedArticle.summary}
                </p>
              </div>

              {/* Step by step checklist */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Các bước thực hiện chuẩn:</span>
                </h3>

                <div className="space-y-3">
                  {selectedArticle.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Warnings */}
              {selectedArticle.tips && selectedArticle.tips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Lưu ý & Khuyến nghị kỹ thuật:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                    {selectedArticle.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Helpful vote */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  Bài viết này có giải quyết được sự cố của bạn không?
                </div>
                <button
                  onClick={() => markHelpful(selectedArticle.id)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition"
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>Hữu ích ({selectedArticle.helpfulCount})</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
              <button
                onClick={() => onSelectArticle(null)}
                className="px-4 py-2 bg-slate-800 text-white font-medium text-xs rounded-lg hover:bg-slate-900"
              >
                Đóng hướng dẫn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Article Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Thêm bài hướng dẫn kỹ thuật mới (Admin)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Hướng dẫn kết nối VPN trường cho cán bộ..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chuyên mục:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                >
                  <option value="wifi_network">Mạng & Wi-Fi</option>
                  <option value="classroom_av">Thiết bị Giảng đường</option>
                  <option value="software">Phần mềm & Ứng dụng</option>
                  <option value="office_email">Tài khoản & Email</option>
                  <option value="lms_elearning">E-Learning & Đào tạo</option>
                  <option value="security">An toàn Bảo mật</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn:</label>
                <textarea
                  required
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Tóm tắt nội dung chính..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Các bước thực hiện (Mỗi bước trên 1 dòng):
                </label>
                <textarea
                  required
                  rows={4}
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  placeholder="Bước 1: Mở cài đặt...&#10;Bước 2: Chọn mạng...&#10;Bước 3: Nhập mật khẩu..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lưu ý & Mẹo kỹ thuật (Mỗi lưu ý trên 1 dòng):
                </label>
                <textarea
                  rows={2}
                  value={newTips}
                  onChange={(e) => setNewTips(e.target.value)}
                  placeholder="Lưu ý: Không tắt nguồn thiết bị đột ngột..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (cách nhau bởi dấu phẩy):</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Wifi, SEB, VPN, KhoaCNTT"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

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
                  Lưu bài hướng dẫn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
