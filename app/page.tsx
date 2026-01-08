import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, Avatar, Typography, Image } from "antd"; // Dùng ANTD Server-side rendering (hạn chế) hoặc wrap client
import CreatePost from "@/components/CreatePost";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
// --- BẮT ĐẦU SỬA ---
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // 1. Import plugin
import "dayjs/locale/vi"; // Import ngôn ngữ tiếng Việt

dayjs.extend(relativeTime); // 2. Kích hoạt plugin relativeTime
dayjs.locale("vi"); // 3. Set ngôn ngữ mặc định
// --- KẾT THÚC SỬA ---

export default async function HomePage() {
  const supabase = createClient();

  // 1. Check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/dang-nhap");
  }

  // 2. Fetch Posts kèm thông tin Profile
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        full_name,
        avatar_url,
        username
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 0" }}>
      <CreatePost user={user} />

      {posts?.map((post) => (
        <Card
          key={post.id}
          style={{ marginBottom: 16, borderRadius: 8 }}
          actions={[
            <span key="like">Thích</span>,
            <span key="comment">Bình luận</span>,
            <span key="share">Chia sẻ</span>,
          ]}
        >
          <Card.Meta
            avatar={
              <Avatar src={post.profiles?.avatar_url} icon={<UserOutlined />} />
            }
            title={
              <div className="flex justify-between items-center">
                <span>{post.profiles?.full_name || "Người dùng ẩn danh"}</span>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined /> {dayjs(post.created_at).fromNow()}
                </Typography.Text>
              </div>
            }
            description={post.content}
          />
          {/* Nếu có ảnh thì hiển thị ở đây */}
          {post.image_url && (
            <Image
              src={post.image_url}
              alt="Post image"
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}
        </Card>
      ))}
    </div>
  );
}
