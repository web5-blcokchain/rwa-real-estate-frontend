import { GlobalDialog } from '@/components/global-dialog'
import MainLayout from '@/components/layouts/main'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import ReactDOM from 'react-dom'
import { ToastContainer } from 'react-toastify'

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent
})

function AppLayoutComponent() {
  return (
    <div>
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
