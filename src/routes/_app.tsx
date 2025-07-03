import { GlobalDialog } from '@/components/dialog/chat-help'
import MainLayout from '@/components/layouts/main'
import { useRouteGuard } from '@/hooks/route-guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import ReactDOM from 'react-dom'
import { ToastContainer } from 'react-toastify'

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent
})

function AppLayoutComponent() {
  // 使用路由守卫
  useRouteGuard()

  return (
    <div className="h-100vh overflow-hidden overflow-y-scroll">
      <GlobalDialog />
      <PortalToast />
      <div className="bg-background text-text">
        <MainLayout>
          <Outlet />
        </MainLayout>
      </div>
    </div>
  )
}

const PortalToast: FC = () => {
  return ReactDOM.createPortal(
    <ToastContainer />,
    document.body
  )
}
