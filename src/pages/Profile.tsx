import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { ProfileProvider, useProfileContext } from "@/context/ProfileContext"

export default function Profile() {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <ProfileContent />
      </SidebarProvider>
    </ProfileProvider>
  )
}

function ProviderRoleSwitch() {
  const { profileUser, switchRole } = useProfileContext()

  console.log("ProviderRoleSwitch profileUser:", profileUser)

  const canBeProvider = profileUser?.is_provider

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="provider-switch" className="text-sm font-medium">
        {profileUser?.role === "provider" ? "Provider" : "Customer"}
      </label>
      <Switch
        id="provider-switch"
        checked={profileUser?.role === "provider"}
        onCheckedChange={() => {
          if (canBeProvider) switchRole()
        }}
        disabled={!canBeProvider}
      />
    </div>
  )
}

function ProfileContent() {
  const { profileUser } = useProfileContext();

  if (profileUser === null) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <AppSidebar profileUser={profileUser} />
        <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {profileUser.role === "provider" ? "Provider Dashbaord" : "Dashboard"}
            <div className="absolute right-5">
              <ProviderRoleSwitch/>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted/50" />
              ))}
            </div>
          </div>
        </SidebarInset>
      </>
    );
  }
}