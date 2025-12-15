import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, ChevronsUpDown } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { cn } from '../ui/utils';
import svgPaths from '../../imports/svg-7hg6d30srz';

interface LogPhaseProps {
  data?: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onComplete: () => void;
  onPrevious?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: 'Objective' | 'Action' | 'Resource' | 'Personnel' | 'Communication';
}

export function LogPhase({ data, onDataChange, onComplete, onPrevious }: LogPhaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntryAction, setNewEntryAction] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [userFilterOpen, setUserFilterOpen] = useState(false);

  // Initialize log entries from data or use mock data
  const [logEntries, setLogEntries] = useState<LogEntry[]>(data?.logEntries || [
    {
      id: '1',
      timestamp: '2025-12-14 14:23:15',
      user: 'Captain Maria Rodriguez',
      action: 'Created Objective',
      details: 'Added operational objective: "Sustain critical defense power at Kaneohe MCB Headquarters and adjacent mission facilities for 48 hours."',
      category: 'Objective'
    },
    {
      id: '2',
      timestamp: '2025-12-14 14:18:42',
      user: 'Col. Hana Kealoha',
      action: 'Updated Action Status',
      details: 'Changed action "Pre‑position fuel and validate generator starts" from Planned to Current.',
      category: 'Action'
    },
    {
      id: '3',
      timestamp: '2025-12-14 14:15:30',
      user: 'Maj. Eric Tan',
      action: 'Added Resource',
      details: 'Registered 3 mobile generators (150kW each) at Kaneohe staging area.',
      category: 'Resource'
    },
    {
      id: '4',
      timestamp: '2025-12-14 14:12:18',
      user: 'Kai Nakamura',
      action: 'Roster Update',
      details: 'Checked in Ken Ito (OT/ICS Security Lead) to incident roster.',
      category: 'Personnel'
    },
    {
      id: '5',
      timestamp: '2025-12-14 14:08:55',
      user: 'System',
      action: 'SITREP Generated',
      details: 'Operational Period 2 situation report generated and distributed to unified command.',
      category: 'Communication'
    },
    {
      id: '6',
      timestamp: '2025-12-14 14:05:12',
      user: 'Ava Ikaika',
      action: 'Updated Objective',
      details: 'Modified objective priority for "Stabilize Oahu grid reliability" to High.',
      category: 'Objective'
    },
    {
      id: '7',
      timestamp: '2025-12-14 13:58:33',
      user: 'Noa Silva',
      action: 'Completed Action',
      details: 'Marked action "Confirm emergency power readiness at high‑lift pumping stations" as complete.',
      category: 'Action'
    },
    {
      id: '8',
      timestamp: '2025-12-14 13:52:45',
      user: 'Dr. Leilani Park',
      action: 'Added Personnel',
      details: 'Added Megan Lau (Public Affairs – JIC) to incident roster.',
      category: 'Personnel'
    }
  ]);

  const handleAddEntry = () => {
    setIsAddingEntry(true);
    setNewEntryAction('');
  };

  const handleSaveEntry = () => {
    if (!newEntryAction.trim()) return;

    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp,
      user: 'Current User',
      action: newEntryAction,
      details: '',
      category: 'Action'
    };

    const updatedEntries = [newEntry, ...logEntries];
    setLogEntries(updatedEntries);
    onDataChange({ ...data, logEntries: updatedEntries });
    setIsAddingEntry(false);
    setNewEntryAction('');
  };

  const handleCancelEntry = () => {
    setIsAddingEntry(false);
    setNewEntryAction('');
  };

  const toggleEntry = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Get unique users from log entries
  const uniqueUsers = Array.from(new Set(logEntries.map(entry => entry.user))).sort();

  const toggleUserFilter = (user: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(user)) {
        next.delete(user);
      } else {
        next.add(user);
      }
      return next;
    });
  };

  // Filter log entries based on search term and selected users
  const filteredEntries = logEntries.filter(entry => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        entry.user.toLowerCase().includes(searchLower) ||
        entry.action.toLowerCase().includes(searchLower) ||
        entry.details.toLowerCase().includes(searchLower) ||
        entry.category.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }
    
    // Filter by selected users
    if (selectedUsers.size > 0 && !selectedUsers.has(entry.user)) {
      return false;
    }
    
    return true;
  });

  const getCategoryColor = (category: LogEntry['category']) => {
    switch (category) {
      case 'Objective':
        return '#6876ee';
      case 'Action':
        return '#22c55e';
      case 'Resource':
        return '#f59e0b';
      case 'Personnel':
        return '#a855f7';
      case 'Communication':
        return '#02a3fe';
      default:
        return '#6e757c';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-[#222529] rounded-lg border border-[#6e757c] relative">
        <div className="flex items-center justify-between px-[13px] py-3 w-full border-b-2 border-border rounded-t-lg rounded-b-none">
          {/* Title */}
          <p className="caption text-nowrap text-white whitespace-pre">Activity Log</p>
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative h-[26px] w-[195px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="box-border w-full h-[26px] bg-transparent border border-[#6e757c] rounded-[4px] px-[26px] py-[3.25px] caption text-white placeholder:text-[#6e757c] focus:outline-none focus:border-accent"
              />
              <div className="absolute left-[8px] size-[11.375px] top-[7.44px] pointer-events-none">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                  <g>
                    <path d={svgPaths.p3a3bec00} stroke="#6E757C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.710938" />
                    <path d={svgPaths.p380aaa80} stroke="#6E757C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.710938" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Button and User Filter - Below Header */}
      <div className="flex items-center justify-start gap-3 px-4">
        <button
          onClick={handleAddEntry}
          className="bg-[#01669f] h-[22.75px] rounded-[4px] w-[130.625px] hover:bg-[#01669f]/90 transition-colors flex items-center justify-center relative"
        >
          <div className="absolute left-[16px] size-[13px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
              <g>
                <path d="M2.70833 6.5H10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
                <path d="M6.5 2.70833V10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
              </g>
            </svg>
          </div>
          <p className="caption text-nowrap text-white ml-[21px]">
            Add Entry
          </p>
        </button>

        {/* User Filter Multi-Select */}
        <Popover open={userFilterOpen} onOpenChange={setUserFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={userFilterOpen}
              className="w-[200px] justify-between h-[22.75px] border-border bg-transparent text-white hover:bg-muted/30"
            >
              <span className="caption">
                {selectedUsers.size === 0
                  ? "Filter by user"
                  : `${selectedUsers.size} user${selectedUsers.size > 1 ? 's' : ''} selected`}
              </span>
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-card border-border">
            <Command className="bg-card">
              <CommandInput placeholder="Search users..." className="h-8 caption" />
              <CommandEmpty className="caption text-muted-foreground py-2 text-center">No user found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {uniqueUsers.map((user) => (
                  <CommandItem
                    key={user}
                    onSelect={() => toggleUserFilter(user)}
                    className="caption cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        selectedUsers.has(user) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Inline Add Entry Form */}
      {isAddingEntry && (
        <div className="border border-border rounded-lg overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(2, 163, 254, 0.08) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(20, 23, 26) 0%, rgb(20, 23, 26) 100%)' }}>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-white mb-2 block">Action</label>
              <Textarea
                value={newEntryAction}
                onChange={(e) => setNewEntryAction(e.target.value)}
                placeholder="Enter action description..."
                className="min-h-[80px] resize-y bg-input-background border-border text-card-foreground caption"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveEntry}
                size="sm"
                className="bg-primary hover:bg-primary/90 h-[22.75px] px-3"
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEntry}
                variant="outline"
                size="sm"
                className="border-border h-[22.75px] px-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Log Entries List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedEntries.has(entry.id);
          return (
            <div
              key={entry.id}
              className="border border-border rounded-lg overflow-hidden"
              style={{ background: 'linear-gradient(90deg, rgba(2, 163, 254, 0.08) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(20, 23, 26) 0%, rgb(20, 23, 26) 100%)' }}
            >
              {/* Entry Header */}
              <div className={`p-3 ${isExpanded ? 'border-b border-border' : ''}`}>
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-start gap-2 flex-1 cursor-pointer"
                    onClick={() => toggleEntry(entry.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="caption text-white">{entry.action}</span>
                      </div>
                      {!isExpanded && (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="caption text-[#6e757c]">{entry.timestamp}</span>
                          <span className="caption text-white">{entry.user}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Entry Details (Expanded) */}
              {isExpanded && (
                <div className="p-4 space-y-4 bg-card/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white mb-1 block">Timestamp</label>
                      <p className="caption text-white">{entry.timestamp}</p>
                    </div>
                    <div>
                      <label className="text-white mb-1 block">User</label>
                      <p className="caption text-white">{entry.user}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-white mb-1 block">Action</label>
                      <p className="caption text-white">{entry.action}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer count */}
      <div className="bg-[#222529] h-[49px] relative w-full">
        <div aria-hidden="true" className="absolute border-[#6e757c] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
        <div className="flex items-center h-[49px] px-6">
          <p className="font-['Open_Sans',_sans-serif] font-normal leading-[18px] text-[#6e757c] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      </div>
    </div>
  );
}

