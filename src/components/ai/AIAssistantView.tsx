import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  HelpCircle,
  User,
  Wrench,
  Flame,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  suggestedAction?: {
    type: 'create_ticket';
    title: string;
    description: string;
  };
}

export const AIAssistantView: React.FC = () => {
  const { setIsCreateModalOpen, setIsLoginModalOpen, currentUser } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Xin chào Thầy/Cô và các bạn sinh viên! Tôi là Trợ Lý Kỹ Thuật Số của Trung tâm CNTT & Thư viện.

Tôi có thể giúp bạn chẩn đoán nhanh và hướng dẫn khắc phục tức thì các sự cố thường gặp:
• Máy chiếu giảng đường báo "No Signal" hoặc nhấp nháy đèn cam
• Không kết nối được Wi-Fi HNMU_Edu hoặc HNMU_Campus
• Quên mật khẩu Cổng đào tạo (portal) hoặc email trường
• Lỗi phần mềm thi trắc nghiệm Safe Exam Browser (SEB)
• Kích hoạt bản quyền Microsoft 365 A3 miễn phí

Bạn đang gặp khó khăn gì, hãy mô tả bên dưới nhé!`,
      time: '08:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const cannedQuestions = [
    'Máy chiếu giảng đường không lên hình từ laptop',
    'Điện thoại báo không kết nối được Wi-Fi trường',
    'Cách lấy lại mật khẩu Cổng quản lý đào tạo',
    'Lỗi phần mềm Safe Exam Browser khi vào phòng thi',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate smart diagnostic response based on keywords
    setTimeout(() => {
      let botResponse = '';
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('máy chiếu') || lower.includes('projector') || lower.includes('hdmi') || lower.includes('màn hình')) {
        botResponse = `🔍 **Chẩn đoán sự cố Máy chiếu:**
1. **Kiểm tra cáp kết nối:** Hãy thử rút cáp HDMI ra khỏi laptop và cắm lại thật chặt (hoặc kiểm tra cổng chuyển đổi Type-C).
2. **Xuất màn hình (Windows):** Nhấn tổ hợp phím **Windows + P**, chọn chế độ **Duplicate** (Nhân đôi màn hình).
3. **Trên máy tính Mac:** Vào Cài đặt hệ thống -> Màn hình -> chọn **Phản chiếu (Mirror Displays)**.
4. **Kiểm tra đèn máy chiếu:** Nếu đèn "Lamp" hoặc "Temp" nháy đỏ/cam, bóng đèn đang bị quá nhiệt hoặc cần thay thế.

👉 Nếu đã thử các bước trên nhưng vẫn không nhận tín hiệu và đang trong giờ giảng dạy, bạn hãy nhấn nút dưới đây để Kỹ thuật viên trực khu vực đến phòng hỗ trợ ngay sau 5-10 phút!`;
        suggestedAction = {
          type: 'create_ticket',
          title: 'Sự cố máy chiếu không nhận tín hiệu trong giờ giảng',
          description: `Đã thử kiểm tra cáp HDMI và phím Windows+P nhưng máy chiếu vẫn không nhận tín hiệu. Cần KTV mang dây cáp hoặc máy chiếu dự phòng hỗ trợ khẩn cấp tại phòng.`,
        };
      } else if (lower.includes('wifi') || lower.includes('mạng') || lower.includes('eduroam') || lower.includes('internet')) {
        botResponse = `📶 **Chẩn đoán sự cố Mạng Wi-Fi trường:**
1. **Chọn đúng tên mạng (SSID):** Sử dụng **HNMU_Edu** hoặc **HNMU_Campus**.
2. **Cấu hình xác thực WPA2-Enterprise:**
   • Phương thức EAP: Chọn **PEAP**
   • Xác thực giai đoạn 2: Chọn **MSCHAPv2**
   • Chứng chỉ CA: Chọn **Không xác thực** (Do not validate)
   • Danh tính (Identity): Nhập toàn bộ email trường (vd: \`minh.nv@hnmu.edu.vn\` hoặc \`masv@hnmu.edu.vn\`)
   • Mật khẩu: Mật khẩu email trường.
3. **Mẹo khắc phục:** Nếu vừa đổi mật khẩu, vào Cài đặt Wi-Fi -> chọn **Quên mạng này (Forget)** rồi kết nối lại.`;
      } else if (lower.includes('mật khẩu') || lower.includes('quên') || lower.includes('password') || lower.includes('portal')) {
        botResponse = `🔑 **Hướng dẫn lấy lại mật khẩu:**
1. Truy cập trang https://portal.hnmu.edu.vn hoặc https://office.com.
2. Nhấn vào liên kết **"Quên mật khẩu?"**.
3. Nhập mã số cán bộ / mã sinh viên để nhận mã xác nhận OTP qua số điện thoại hoặc email phụ đã đăng ký trên hồ sơ.
4. Nếu số điện thoại cũ không còn dùng, bạn cần gửi phiếu yêu cầu hỗ trợ kèm ảnh chụp Thẻ viên chức/Thẻ sinh viên để quản trị viên đối soát cấp lại.`;
        suggestedAction = {
          type: 'create_ticket',
          title: 'Đề nghị cấp lại mật khẩu tài khoản Cổng đào tạo/Email',
          description: 'Tôi bị quên mật khẩu và số điện thoại đăng ký cũ không còn sử dụng. Đề nghị bộ phận kỹ thuật hỗ trợ cấp lại.',
        };
      } else if (lower.includes('seb') || lower.includes('thi') || lower.includes('khảo thí')) {
        botResponse = `💻 **Xử lý lỗi Safe Exam Browser (SEB):**
1. Đảm bảo bạn đã tải đúng phiên bản SEB tương thích hệ điều hành từ https://safeexambrowser.org.
2. Trước khi mở tệp cấu hình \`.seb\`, hãy tắt triệt để các phần mềm nền: Zalo, Telegram, UltraViewer, TeamViewer, OBS, Discord.
3. Nếu báo lỗi "The service is not running", hãy khởi động lại máy tính (Restart PC).
4. Cấp quyền Camera & Micro cho SEB trong mục Quyền riêng tư (Privacy) của Windows/macOS.`;
      } else {
        botResponse = `Cảm ơn bạn đã chia sẻ hiện tượng: "${query}".

Trung tâm CNTT ghi nhận yêu cầu này. Để kỹ thuật viên kiểm tra trực tiếp và phân công xử lý theo chuẩn SLA, bạn có thể tạo ngay một phiếu hỗ trợ:`;
        suggestedAction = {
          type: 'create_ticket',
          title: query.substring(0, 80),
          description: query,
        };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Assistant Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-purple-300 border border-purple-400/30">
            <Bot className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hỗ Trợ Tự Phục Vụ 24/7 (Self-Service Diagnostics)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Trợ Lý Kỹ Thuật Số CNTT Trường Đại Học</h1>
            <p className="text-xs text-slate-300">
              Chẩn đoán tức thì, mẹo khắc phục nhanh trước khi cần kỹ thuật viên đến tận nơi
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Câu hỏi phổ biến thường gặp tại trường:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cannedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col h-[520px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`space-y-2 max-w-[85%] ${isBot ? '' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                      isBot
                        ? 'bg-slate-50 border border-slate-200 text-slate-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {m.text}

                    {/* Action button inside bot message if suggested */}
                    {m.suggestedAction && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80">
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              setIsLoginModalOpen(true);
                            } else {
                              setIsCreateModalOpen(true);
                            }
                          }}
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-2"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Chuyển thành Phiếu Báo Lỗi Kỹ Thuật Viên Có Mặt Ngay</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 px-1">{m.time}</div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-2xl text-xs text-slate-500 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                <span className="ml-1 text-[11px]">Trợ lý đang tra cứu sổ tay kỹ thuật...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-4 border-t border-slate-100 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi hoặc mô tả triệu chứng sự cố máy tính, máy chiếu, mạng..."
            className="flex-1 text-xs sm:text-sm border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi câu hỏi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
