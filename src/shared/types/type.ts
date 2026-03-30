export type NavItem = {
  text: string;
  href: string;
  icon: React.ElementType;
  position: "main" | "bottom";
};

export type DropboxGradeStudents = {
  grade: string;
  groups: {
    id: string;
    label: string;
  }[];
};
