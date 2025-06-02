import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TrendingUp, DollarSign, Activity } from "lucide-react"
import { Hello } from "@/components/hello"

// Mock data for demonstration
const todayStats = {
  totalPnL: 2847.5,
  totalTrades: 23,
  winRate: 68.2,
  activeAlgorithms: 4,
}

const algorithmPerformance = [
  { name: "Momentum Scalper", pnl: 1250.3, trades: 8, status: "active", winRate: 75 },
  { name: "Mean Reversion", pnl: 890.2, trades: 6, status: "active", winRate: 66.7 },
  { name: "Breakout Hunter", pnl: 450.8, trades: 5, status: "active", winRate: 60 },
  { name: "Grid Trading", pnl: 256.2, trades: 4, status: "active", winRate: 75 },
  { name: "Arbitrage Bot", pnl: 0, trades: 0, status: "inactive", winRate: 0 },
]

const recentTrades = [
  {
    time: "14:32",
    algorithm: "Momentum Scalper",
    symbol: "AAPL",
    side: "BUY",
    quantity: 100,
    price: 185.42,
    pnl: 125.5,
  },
  { time: "14:28", algorithm: "Mean Reversion", symbol: "TSLA", side: "SELL", quantity: 50, price: 242.18, pnl: -45.2 },
  { time: "14:25", algorithm: "Breakout Hunter", symbol: "NVDA", side: "BUY", quantity: 25, price: 875.3, pnl: 89.75 },
  { time: "14:20", algorithm: "Grid Trading", symbol: "SPY", side: "SELL", quantity: 200, price: 445.67, pnl: 67.4 },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Trading Dashboard</h1>
            <p className="text-muted-foreground">Today's Performance Overview</p>
          </div>
        </div>
      </header>
      <Hello />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${todayStats.totalPnL.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.totalTrades}</div>
              <p className="text-xs text-muted-foreground">Across {todayStats.activeAlgorithms} algorithms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.winRate}%</div>
              <p className="text-xs text-muted-foreground">Above 65% target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Algorithms</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.activeAlgorithms}</div>
              <p className="text-xs text-muted-foreground">1 inactive</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Algorithm Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Performance</CardTitle>
              <CardDescription>Today's P&L by algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {algorithmPerformance.map((algo) => (
                  <div key={algo.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={algo.status === "active" ? "default" : "secondary"}>{algo.status}</Badge>
                      <div>
                        <p className="font-medium">{algo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {algo.trades} trades • {algo.winRate}% win rate
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${algo.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      <p className="font-medium">
                        {algo.pnl >= 0 ? "+" : ""}${algo.pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Latest algorithm executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">{trade.time}</div>
                      <div>
                        <p className="font-medium">{trade.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {trade.algorithm} • {trade.side} {trade.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${trade.price}</p>
                      <p className={`text-sm ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
