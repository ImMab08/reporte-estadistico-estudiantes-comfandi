export type NavItem = {
  text: string;
  href: string;
  icon: React.ElementType;
  position: "main" | "bottom";
  adminOnly?: boolean;
  children?: NavItemChild[];
};

export type NavItemChild = {
  text: string;
  href: string;
  icon: React.ElementType;
};

export type DropboxGradeStudents = {
  grade: string;
  groups: {
    id: string;
    label: string;
  }[];
};
