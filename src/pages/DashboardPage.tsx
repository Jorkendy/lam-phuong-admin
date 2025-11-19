import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  return (
    <AppLayout>
      <div className="min-h-full bg-background">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>You are successfully logged in</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is a protected dashboard page. Only authenticated users can access this page.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Content</CardTitle>
                <CardDescription>Your dashboard content goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your dashboard widgets, charts, and other content here.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Protected Route</CardTitle>
                <CardDescription>Route guard is working</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This page is protected by a route guard. Unauthenticated users will be redirected to the login page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

