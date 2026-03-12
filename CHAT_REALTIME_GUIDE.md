# 💬 Hệ thống Chat Real-time - Vitechs

## 🎯 Tổng quan

Hệ thống chat real-time giữa User và Admin sử dụng **Socket.IO** với các tính năng:

- ✅ Chat trực tiếp user ↔ admin
- ✅ Nhiều rooms, mỗi user 1 room riêng
- ✅ Admin có thể nhận và trả lời nhiều chat
- ✅ Lưu lịch sử chat vào database
- ✅ Thông báo real-time
- ✅ Trạng thái online/offline
- ✅ Đánh dấu đã đọc

---

## 📦 Đã cài đặt

### Backend
```bash
npm install socket.io
```

### Frontend  
```bash
npm install socket.io-client
```

---

## 🗄️ Database Models

### 1. **ChatRoom** (`chat_rooms`)
- `id`: ID room
- `userId`: ID user (email hoặc unique ID)
- `userName`: Tên user
- `userEmail`: Email user (optional)
- `adminId`: ID admin đang hỗ trợ
- `status`: `waiting` | `active` | `closed`
- `lastMessageAt`: Thời gian tin nhắn cuối

### 2. **ChatMessage** (`chat_messages`)
- `id`: ID tin nhắn
- `roomId`: ID room
- `senderType`: `user` | `admin`
- `senderId`: ID người gửi
- `senderName`: Tên người gửi
- `message`: Nội dung tin nhắn
- `isRead`: Đã đọc chưa

---

## 🚀 Cách chạy

### 1. Thêm env variable (frontend)

Tạo/cập nhật file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 2. Khởi động server

```bash
# Backend
cd backend
npm run dev

# Frontend (terminal khác)
cd frontend
npm run dev
```

### 3. Truy cập

- **User**: http://localhost:3000 → Click icon chat góc dưới bên phải
- **Admin**: http://localhost:3000/admin/chats

---

## 🔄 Luồng hoạt động

### User Side:

1. User click icon chat → Mở chatbox
2. Nhập tên (và email optional) → Join chat
3. Socket tạo/tìm room → Load lịch sử chat
4. User gửi tin nhắn → Emit `message:send`
5. Nhận tin nhắn từ admin qua `message:received`

### Admin Side:

1. Admin vào `/admin/chats` → Join as admin
2. Nhận danh sách rooms (`waiting` và `active`)
3. Click chọn room → Emit `admin:pick-room`
4. Load tin nhắn → Bắt đầu chat
5. Admin có thể đóng chat → Emit `admin:close-room`

---

## 📡 Socket Events

### User Events:
- `user:join` - User tham gia chat
- `message:send` - Gửi tin nhắn
- `room:joined` - Đã join room (nhận lịch sử)
- `message:received` - Nhận tin nhắn mới
- `admin:joined` - Admin vào hỗ trợ
- `room:closed` - Room đã đóng

### Admin Events:
- `admin:join` - Admin tham gia
- `admin:pick-room` - Admin chọn room
- `admin:rooms-list` - Danh sách rooms
- `admin:new-user-waiting` - User mới chờ
- `admin:new-message` - Tin nhắn mới từ user
- `admin:close-room` - Đóng room
- `message:send` - Gửi tin nhắn
- `message:received` - Nhận tin nhắn
- `message:mark-read` - Đánh dấu đã đọc

---

## 🎨 UI Components

### Frontend Components:

1. **`UserChatbox.tsx`** (`/components/chat/`)
   - Floating chatbox cho user
   - Form nhập tên
   - Chat interface
   - Tự động scroll
   - Minimize/Close

2. **Admin Chat Page** (`/app/admin/chats/page.tsx`)
   - Danh sách rooms
   - Chi tiết chat
   - Gửi/nhận tin nhắn
   - Đóng room

---

## 🔧 Backend Services

### `socketService.js`
- Quản lý Socket.IO connections
- Xử lý events
- Track online users/admins
- Broadcast messages

### API Routes (`/api/v1/chat`)
- `GET /rooms` - Lấy danh sách rooms
- `GET /rooms/:id` - Chi tiết room
- `GET /rooms/:roomId/messages` - Lịch sử chat
- `GET /unread-count` - Số tin nhắn chưa đọc

---

## ✨ Tính năng nâng cao (có thể mở rộng)

### Đã có:
- ✅ Real-time messaging
- ✅ Room management
- ✅ Message history
- ✅ Admin assignment

### Có thể thêm:
- 🔜 Typing indicator (đang gõ...)
- 🔜 File/image upload trong chat
- 🔜 Emoji picker
- 🔜 Notification sound
- 🔜 Transfer chat giữa admins
- 🔜 Chat rating/feedback
- 🔜 Auto-reply khi admin offline
- 🔜 Chat statistics dashboard

---

## 🐛 Troubleshooting

### Socket không kết nối?
- Kiểm tra `NEXT_PUBLIC_SOCKET_URL` trong `.env.local`
- Đảm bảo backend đang chạy
- Check console log trong browser

### Tin nhắn không hiển thị?
- Check socket connection status
- Xem logs trong terminal backend
- Kiểm tra database có lưu tin nhắn không

### Admin không nhận được thông báo?
- Đảm bảo admin đã join (`admin:join`)
- Check socket room (`admin-room`)

---

## 📝 Testing

### Test User Chat:
1. Mở http://localhost:3000
2. Click icon chat
3. Nhập tên → Join
4. Gửi tin nhắn

### Test Admin Chat:
1. Login admin: http://localhost:3000/admin/login
2. Vào http://localhost:3000/admin/chats
3. Chọn room từ danh sách
4. Trả lời tin nhắn

### Test Real-time:
- Mở 2 browser (hoặc incognito)
- 1 browser: user chat
- 1 browser: admin chat
- Gửi tin nhắn từ 2 bên → Kiểm tra real-time

---

## 🎓 Kiến thức cần biết

### Socket.IO Concepts:
- **Events**: emit/on để gửi/nhận
- **Rooms**: Nhóm sockets lại (mỗi chat room)
- **Broadcasting**: Gửi tin cho nhiều clients
- **Acknowledgments**: Xác nhận đã nhận

### Best Practices:
- Disconnect socket khi component unmount
- Xử lý reconnection
- Validate data trước khi emit
- Lưu lịch sử vào DB
- Rate limit để chống spam

---

## 🔐 Security Notes

✅ **Đã implement:**
- JWT auth cho admin routes
- Validate tin nhắn
- Rate limiting (backend level)

⚠️ **Nên thêm:**
- Throttle số tin nhắn/giây
- Sanitize HTML trong tin nhắn
- Encrypt sensitive messages
- Block spam users

---

## 📚 Tài liệu tham khảo

- Socket.IO Docs: https://socket.io/docs/v4/
- React Socket.IO: https://socket.io/how-to/use-with-react
- Sequelize Relations: https://sequelize.org/docs/v6/core-concepts/assocs/

---

**Hoàn thành! 🎉**

Bây giờ bạn đã có hệ thống chat real-time đầy đủ tính năng.
