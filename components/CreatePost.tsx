"use client";
import { useState } from "react";
import { Card, Input, Button, message, Avatar } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { createClient } from "@/utils/supabase/client";
// 1. Import type User từ supabase-js
import { User } from "@supabase/supabase-js";

// 2. Định nghĩa lại kiểu cho props
interface CreatePostProps {
  user: User;
}

export default function CreatePost({ user }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("posts").insert({
      user_id: user.id, // TypeScript sẽ tự hiểu id là string
      content: content,
    });

    if (error) {
      message.error("Lỗi khi đăng bài: " + error.message);
    } else {
      message.success("Đã đăng bài thành công!");
      setContent("");
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <Card style={{ marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <div className="flex gap-4">
        <Avatar
          // user_metadata có thể null, nên dùng optional chaining ?.
          src={user.user_metadata?.avatar_url}
          icon={<UserOutlined />}
          size="large"
        />
        <div className="flex-1">
          <Input.TextArea
            placeholder={`Bạn đang nghĩ gì, ${
              user.user_metadata?.full_name || "bạn"
            }?`}
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handlePost}
              loading={loading}
            >
              Đăng bài
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
