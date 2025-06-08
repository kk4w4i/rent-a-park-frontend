import * as React from "react"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function Menu({
  menus,
  selected,
  onSelect,
}: {
  menus: { name: string; items: string[] }[];
  selected: string | null;
  onSelect: (item: string) => void;
}) {
  return (
    <>
      {menus.map((menu, index) => (
        <React.Fragment key={menu.name}>
          <SidebarGroup className="py-0">
            <Collapsible defaultOpen={index === 0} className="group/collapsible">
              <SidebarGroupLabel asChild className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm">
                <CollapsibleTrigger>
                  {menu.name}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menu.items.map((item) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton
                          className={selected === item ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                          onClick={() => onSelect(item)}
                        >
                          {item}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}
