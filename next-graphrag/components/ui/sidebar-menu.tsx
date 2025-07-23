import React from "react";

interface SidebarMenuButtonProps {
  label: string;
  onClick?: () => void;
}

const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

interface SidebarMenuItemProps {
  label: string;
  href?: string;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ label, href }) => {
  return (
    <li>
      <a href={href}>
        {label}
      </a>
    </li>
  );
};

export { SidebarMenuButton, SidebarMenuItem };