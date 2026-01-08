import StyledComponentsRegistry from "@/components/AntdRegistry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN"; // Localization tiếng Việt
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <StyledComponentsRegistry>
          <ConfigProvider locale={viVN}>{children}</ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
