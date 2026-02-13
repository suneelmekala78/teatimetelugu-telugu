export type Role = "user" | "writer" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileUrl: string;
  role: Role;
  lang: "en" | "te";
  isActive: boolean;
}
