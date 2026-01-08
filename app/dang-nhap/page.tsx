"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Tabs,
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginFieldType {
  email?: string;
  password?: string;
}

interface RegisterFieldType {
  fullname?: string;
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Xử lý Đăng nhập
  const onLogin = async (values: LoginFieldType) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email || "",
      password: values.password || "",
    });

    if (error) {
      message.error("Đăng nhập thất bại: " + error.message);
    } else {
      message.success("Chào mừng trở lại!");
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  // Xử lý Đăng ký
  const onRegister = async (values: RegisterFieldType) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email || "",
      password: values.password || "",
      options: {
        data: {
          full_name: values.fullname,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            values.fullname || "User"
          )}&background=random`,
        },
      },
    });

    if (error) {
      message.error("Đăng ký thất bại: " + error.message);
    } else {
      message.success("Đăng ký thành công! Vui lòng kiểm tra email.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) message.error(error.message);
  };

  // UI Components cho Form
  const renderLoginForm = () => (
    <Form name="login" onFinish={onLogin} layout="vertical" size="large">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập Email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={loading}>
        Đăng nhập
      </Button>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form name="register" onFinish={onRegister} layout="vertical" size="large">
      <Form.Item
        name="fullname"
        rules={[{ required: true, message: "Vui lòng nhập họ tên hiển thị!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Họ và tên hiển thị" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập Email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={loading}>
        Đăng ký tài khoản
      </Button>
    </Form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            VN Social
          </Title>
          <Text type="secondary">Kết nối cộng đồng Việt</Text>
        </div>

        <Tabs
          defaultActiveKey="1"
          items={[
            { key: "1", label: "Đăng nhập", children: renderLoginForm() },
            { key: "2", label: "Đăng ký", children: renderRegisterForm() },
          ]}
          centered
        />

        <Divider plain>Hoặc</Divider>

        <Button icon={<GoogleOutlined />} block onClick={handleGoogleLogin}>
          Tiếp tục với Google
        </Button>
      </Card>
    </div>
  );
}
