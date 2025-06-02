"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Settings, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock algorithm data
const initialAlgorithms = [
  {
    id: 1,
    name: "Momentum Scalper",
    description: "High-frequency momentum-based scalping strategy",
    isActive: true,
    performance: { pnl: 1250.3, winRate: 75, trades: 8 },
    alerts: { profitTarget: 500, lossLimit: -200, enabled: true },
  },
  {
    id: 2,
    name: "Mean Reversion",
    description: "Statistical arbitrage using mean reversion signals",
    isActive: true,
    performance: { pnl: 890.2, winRate: 66.7, trades: 6 },
    alerts: { profitTarget: 400, lossLimit: -150, enabled: true },
  },
  {
    id: 3,
    name: "Breakout Hunter",
    description: "Identifies and trades breakout patterns",
    isActive: true,
    performance: { pnl: 450.8, winRate: 60, trades: 5 },
    alerts: { profitTarget: 300, lossLimit: -100, enabled: false },
  },
  {
    id: 4,
    name: "Grid Trading",
    description: "Grid-based trading for ranging markets",
    isActive: true,
    performance: { pnl: 256.2, winRate: 75, trades: 4 },
    alerts: { profitTarget: 200, lossLimit: -80, enabled: true },
  },
  {
    id: 5,
    name: "Arbitrage Bot",
    description: "Cross-exchange arbitrage opportunities",
    isActive: false,
    performance: { pnl: 0, winRate: 0, trades: 0 },
    alerts: { profitTarget: 100, lossLimit: -50, enabled: false },
  },
]

export default function AlgorithmsPage() {
  const [algorithms, setAlgorithms] = useState(initialAlgorithms)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)

  const toggleAlgorithm = (id: number) => {
    setAlgorithms((prev) => prev.map((algo) => (algo.id === id ? { ...algo, isActive: !algo.isActive } : algo)))
  }

  const updateAlerts = (id: number, alerts: any) => {
    setAlgorithms((prev) => prev.map((algo) => (algo.id === id ? { ...algo, alerts } : algo)))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Trading Algorithms</h1>
            <p className="text-muted-foreground">Manage and monitor your trading strategies</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {algorithms.map((algorithm) => (
            <Card key={algorithm.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                    <CardDescription>{algorithm.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={algorithm.isActive ? "default" : "secondary"}>
                      {algorithm.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Switch checked={algorithm.isActive} onCheckedChange={() => toggleAlgorithm(algorithm.id)} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">P&L</p>
                    <p
                      className={`font-semibold ${algorithm.performance.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {algorithm.performance.pnl >= 0 ? "+" : ""}${algorithm.performance.pnl.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="font-semibold">{algorithm.performance.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trades</p>
                    <p className="font-semibold">{algorithm.performance.trades}</p>
                  </div>
                </div>

                {/* Alert Status */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell
                      className={`h-4 w-4 ${algorithm.alerts.enabled ? "text-blue-600" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">Alerts</span>
                    {algorithm.alerts.enabled && (
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Setup
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alert Settings - {algorithm.name}</DialogTitle>
                        <DialogDescription>
                          Configure profit targets and loss limits for this algorithm
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={algorithm.alerts.enabled}
                            onCheckedChange={(enabled) => updateAlerts(algorithm.id, { ...algorithm.alerts, enabled })}
                          />
                          <Label>Enable Alerts</Label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Profit Target ($)</Label>
                            <Input
                              type="number"
                              value={algorithm.alerts.profitTarget}
                              onChange={(e) =>
                                updateAlerts(algorithm.id, {
                                  ...algorithm.alerts,
                                  profitTarget: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Loss Limit ($)</Label>
                            <Input
                              type="number"
                              value={algorithm.alerts.lossLimit}
                              onChange={(e) =>
                                updateAlerts(algorithm.id, {
                                  ...algorithm.alerts,
                                  lossLimit: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Alert Method</Label>
                          <Select defaultValue="email">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="push">Push Notification</SelectItem>
                              <SelectItem value="all">All Methods</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
