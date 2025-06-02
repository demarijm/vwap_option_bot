"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Shield, Bell, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)

  const [brokerSettings, setBrokerSettings] = useState({
    broker: "alpaca",
    apiKey: "PKTEST1234567890",
    apiSecret: "abcdef1234567890",
    environment: "paper",
    connected: true,
  })

  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    email: "trader@example.com",
    phone: "+1234567890",
  })

  const [riskSettings, setRiskSettings] = useState({
    maxDailyLoss: 1000,
    maxPositionSize: 10000,
    maxOpenPositions: 5,
    enableKillSwitch: true,
  })

  const handleSaveBrokerSettings = () => {
    toast({
      title: "Broker settings saved",
      description: "Your broker configuration has been updated successfully.",
    })
  }

  const handleTestConnection = () => {
    toast({
      title: "Connection test initiated",
      description: "Testing connection to your broker...",
    })

    // Simulate connection test
    setTimeout(() => {
      toast({
        title: "Connection successful",
        description: "Successfully connected to your broker account.",
      })
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your trading environment and preferences</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <Tabs defaultValue="broker" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="broker">Broker</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          {/* Broker Settings */}
          <TabsContent value="broker">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Broker Configuration
                    </CardTitle>
                    <CardDescription>Connect your trading algorithms to your broker account</CardDescription>
                  </div>
                  <Badge variant={brokerSettings.connected ? "default" : "destructive"}>
                    {brokerSettings.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Broker</Label>
                    <Select
                      value={brokerSettings.broker}
                      onValueChange={(value) => setBrokerSettings({ ...brokerSettings, broker: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alpaca">Alpaca</SelectItem>
                        <SelectItem value="interactive_brokers">Interactive Brokers</SelectItem>
                        <SelectItem value="td_ameritrade">TD Ameritrade</SelectItem>
                        <SelectItem value="schwab">Charles Schwab</SelectItem>
                        <SelectItem value="etrade">E*TRADE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select
                      value={brokerSettings.environment}
                      onValueChange={(value) => setBrokerSettings({ ...brokerSettings, environment: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paper">Paper Trading</SelectItem>
                        <SelectItem value="live">Live Trading</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={brokerSettings.apiKey}
                        onChange={(e) => setBrokerSettings({ ...brokerSettings, apiKey: e.target.value })}
                        placeholder="Enter your API key"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <div className="relative">
                      <Input
                        type={showApiSecret ? "text" : "password"}
                        value={brokerSettings.apiSecret}
                        onChange={(e) => setBrokerSettings({ ...brokerSettings, apiSecret: e.target.value })}
                        placeholder="Enter your API secret"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                      >
                        {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleTestConnection} variant="outline">
                    Test Connection
                  </Button>
                  <Button onClick={handleSaveBrokerSettings}>Save Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alert Settings */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Preferences
                </CardTitle>
                <CardDescription>Configure how you want to receive trading alerts and notifications</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch
                      checked={alertSettings.emailNotifications}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                    </div>
                    <Switch
                      checked={alertSettings.smsNotifications}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, smsNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={alertSettings.pushNotifications}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, pushNotifications: checked })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={alertSettings.email}
                      onChange={(e) => setAlertSettings({ ...alertSettings, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      value={alertSettings.phone}
                      onChange={(e) => setAlertSettings({ ...alertSettings, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <Button>Save Alert Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Management */}
          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Management
                </CardTitle>
                <CardDescription>Set up safety limits and risk controls for your trading algorithms</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Daily Loss ($)</Label>
                    <Input
                      type="number"
                      value={riskSettings.maxDailyLoss}
                      onChange={(e) => setRiskSettings({ ...riskSettings, maxDailyLoss: Number(e.target.value) })}
                      placeholder="1000"
                    />
                    <p className="text-xs text-muted-foreground">
                      All algorithms will stop if daily loss exceeds this amount
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Position Size ($)</Label>
                    <Input
                      type="number"
                      value={riskSettings.maxPositionSize}
                      onChange={(e) => setRiskSettings({ ...riskSettings, maxPositionSize: Number(e.target.value) })}
                      placeholder="10000"
                    />
                    <p className="text-xs text-muted-foreground">Maximum value for any single position</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Open Positions</Label>
                  <Input
                    type="number"
                    value={riskSettings.maxOpenPositions}
                    onChange={(e) => setRiskSettings({ ...riskSettings, maxOpenPositions: Number(e.target.value) })}
                    placeholder="5"
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of concurrent open positions</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Emergency Kill Switch</Label>
                    <p className="text-sm text-muted-foreground">Enable emergency stop for all algorithms</p>
                  </div>
                  <Switch
                    checked={riskSettings.enableKillSwitch}
                    onCheckedChange={(checked) => setRiskSettings({ ...riskSettings, enableKillSwitch: checked })}
                  />
                </div>

                <Button>Save Risk Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>Configure general application settings and preferences</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="america/new_york">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency Display</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Refresh Rate</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500ms (High frequency)</SelectItem>
                        <SelectItem value="1000">1 second (Default)</SelectItem>
                        <SelectItem value="5000">5 seconds (Conservative)</SelectItem>
                        <SelectItem value="10000">10 seconds (Low bandwidth)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button>Save General Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
