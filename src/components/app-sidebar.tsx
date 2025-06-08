import { Menu } from "@/components/menu"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ProfileUser } from "@/types/ProfileUser"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  profileUser: ProfileUser
}

export function AppSidebar({ profileUser, selectedMenu, onSelectMenu, ...props }: AppSidebarProps & {
  selectedMenu: string | null;
  onSelectMenu: (item: string) => void;
}) {
  console.log(profileUser.role)
  const user =  {
        firstname: profileUser.firstname,
        lastname: profileUser.lastname,
        email: profileUser.email,
        avatar: "/avatars/default.jpg", // You can customize this
      }

  // Menus adjust based on role
  const menus =
    profileUser && profileUser.role === "provider"
      ? [
          {
            name: "My Bookings",
            items: ["Booked", "Requested", "Denied"],
          },
          {
            name: "My Listings",
            items: ["Listed", "Pending", "Closed"],
          },
        ]
      : [
          {
            name: "My Bookings",
            items: ["Booked", "Requested", "Denied"],
          },
        ]

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <Menu menus={menus} selected={selectedMenu} onSelect={onSelectMenu} />
      </SidebarContent>
    </Sidebar>
  )
}
