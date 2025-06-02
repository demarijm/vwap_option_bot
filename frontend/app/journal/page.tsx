"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, BookOpen, TrendingUp, TrendingDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock journal entries
const initialEntries = [
  {
    id: 1,
    date: "2024-01-15",
    pnl: 2847.5,
    trades: 23,
    mood: "confident",
    notes:
      "Great day overall. Momentum Scalper performed exceptionally well during the morning session. Market volatility was perfect for our strategies. Need to watch for potential reversal signals tomorrow.",
    lessons: "Patience paid off - waited for clear signals instead of forcing trades",
    improvements: "Could have sized up positions during the strongest momentum moves",
  },
  {
    id: 2,
    date: "2024-01-14",
    pnl: -156.3,
    trades: 18,
    mood: "frustrated",
    notes:
      "Choppy market conditions caught several algorithms off guard. Mean reversion strategy struggled with false signals. Stopped trading early to preserve capital.",
    lessons: "Market regime recognition is crucial - should have reduced position sizes",
    improvements: "Need better filters for low-volatility environments",
  },
  {
    id: 3,
    date: "2024-01-13",
    pnl: 1234.8,
    trades: 15,
    mood: "satisfied",
    notes:
      "Solid performance across all active algorithms. Breakout Hunter caught a nice move in NVDA. Grid trading worked well in ranging conditions for SPY.",
    lessons: "Diversification across strategies helps smooth returns",
    improvements: "Monitor correlation between algorithms more closely",
  },
]

export default function JournalPage() {
  const [entries, setEntries] = useState(initialEntries)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    pnl: "",
    trades: "",
    mood: "",
    notes: "",
    lessons: "",
    improvements: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const addEntry = () => {
    const entry = {
      id: entries.length + 1,
      ...newEntry,
      pnl: Number.parseFloat(newEntry.pnl) || 0,
      trades: Number.parseInt(newEntry.trades) || 0,
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      pnl: "",
      trades: "",
      mood: "",
      notes: "",
      lessons: "",
      improvements: "",
    })
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.lessons.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.improvements.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "confident":
        return "bg-green-100 text-green-800"
      case "satisfied":
        return "bg-blue-100 text-blue-800"
      case "frustrated":
        return "bg-red-100 text-red-800"
      case "neutral":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Trading Journal</h1>
              <p className="text-muted-foreground">Track your daily trading insights and lessons</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Journal Entry</DialogTitle>
                <DialogDescription>Record your trading day insights and lessons learned</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>P&L ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newEntry.pnl}
                      onChange={(e) => setNewEntry({ ...newEntry, pnl: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Trades</Label>
                    <Input
                      type="number"
                      value={newEntry.trades}
                      onChange={(e) => setNewEntry({ ...newEntry, trades: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mood/Confidence</Label>
                  <Input
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                    placeholder="e.g., confident, frustrated, neutral"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trading Notes</Label>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="What happened today? Market conditions, algorithm performance, notable trades..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lessons Learned</Label>
                  <Textarea
                    value={newEntry.lessons}
                    onChange={(e) => setNewEntry({ ...newEntry, lessons: e.target.value })}
                    placeholder="What did you learn from today's trading?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Areas for Improvement</Label>
                  <Textarea
                    value={newEntry.improvements}
                    onChange={(e) => setNewEntry({ ...newEntry, improvements: e.target.value })}
                    placeholder="What could be improved for tomorrow?"
                    rows={3}
                  />
                </div>

                <Button onClick={addEntry} className="w-full">
                  Save Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                    </div>
                    {entry.mood && <Badge className={getMoodColor(entry.mood)}>{entry.mood}</Badge>}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${entry.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {entry.pnl >= 0 ? "+" : ""}${entry.pnl.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">{entry.trades} trades</div>
                    </div>
                    {entry.pnl >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Trading Notes
                  </h4>
                  <p className="text-muted-foreground">{entry.notes}</p>
                </div>

                {entry.lessons && (
                  <div>
                    <h4 className="font-medium mb-2">Lessons Learned</h4>
                    <p className="text-muted-foreground">{entry.lessons}</p>
                  </div>
                )}

                {entry.improvements && (
                  <div>
                    <h4 className="font-medium mb-2">Areas for Improvement</h4>
                    <p className="text-muted-foreground">{entry.improvements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No journal entries found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start documenting your trading journey"}
            </p>
            {!searchTerm && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Entry
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
