
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Wrench, 
  ClipboardCheck, 
  FileText, 
  Package,
  Upload as UploadIcon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Custom Pneu icon component
const PneuIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const menuItems = [
  {
    title: "Upload",
    icon: UploadIcon,
    url: "/upload"
  },
  {
    title: "Gestão de Pneus",
    icon: PneuIcon,
    subItems: [
      { title: "Laudos", url: "/gestao-laudos", icon: FileText },
      { title: "Estoque", url: "/gestao-estoque", icon: Package }
    ]
  },
  {
    title: "Gestão de Manutenção",
    icon: Wrench,
    url: "/gestao-manutencao",
    disabled: true
  },
  {
    title: "Check List",
    icon: ClipboardCheck,
    url: "/checklist"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = (active: boolean) =>
    active ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar collapsible="icon" className="border-r bg-slate-800 text-white">
      <SidebarHeader className="border-b border-slate-700 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-white hover:bg-slate-700" />
          {!collapsed && (
            <h2 className="font-bold text-lg text-white">JC Transportes</h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-800">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible 
                      defaultOpen={item.subItems.some(sub => isActive(sub.url))}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`${getNavCls(item.subItems.some(sub => isActive(sub.url)))} text-white hover:bg-slate-700`}
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={({ isActive }) => `${getNavCls(isActive)} text-white hover:bg-slate-700`}
                                  >
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      className={`${getNavCls(isActive(item.url || ''))} text-white hover:bg-slate-700`}
                      disabled={item.disabled}
                    >
                      <NavLink to={item.url || '#'}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
