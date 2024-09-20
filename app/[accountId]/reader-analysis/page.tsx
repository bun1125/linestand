'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, MessageCircle, Reply, Search, ArrowUpDown } from "lucide-react"
import { format, isWithinInterval } from 'date-fns'
import { ja } from 'date-fns/locale'
import Layout from '@/components/layouts/DashboardLayout'

interface User {
  id: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  language: string;
  tags: string[];
  statusId: string;
  gclid: string;
  lastMessageAt: Date;
  notes: string;
  pin: boolean;
  scenarioId: string;
  scenarioModifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LineAccount {
  id: string;
  accountName: string;
  users: User[];
}

const generateUsers = (count: number): User[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    displayName: `読者 ${i + 1}`,
    pictureUrl: `/placeholder.svg?height=40&width=40`,
    statusMessage: `ステータスメッセージ ${i + 1}`,
    language: 'ja',
    tags: i % 5 === 0
      ? [...Array(Math.floor(Math.random() * 10) + 5)].map(() => `タグ${Math.floor(Math.random() * 100)}`)
      : ['タグ1', 'タグ2', 'タグ3'].slice(0, Math.floor(Math.random() * 3) + 1),
    statusId: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
    gclid: `gclid-${i + 1}`,
    lastMessageAt: new Date(2023, 0, 1 + i),
    notes: `ユーザーノート ${i + 1}`,
    pin: i % 10 === 0,
    scenarioId: `シナリオ ${Math.floor(i / 20) + 1}`,
    scenarioModifiedAt: new Date(2023, 0, 1 + i),
    createdAt: new Date(2023, 0, 1 + i),
    updatedAt: new Date(2023, 0, 1 + i),
  }));

const generateLineAccounts = (count: number): LineAccount[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `account-${i + 1}`,
    accountName: `LINEアカウント ${i + 1}`,
    users: generateUsers(200),
  }));

const lineAccounts = generateLineAccounts(3);

export function ReaderListPageComponent() {
  const [currentAccount, setCurrentAccount] = useState(lineAccounts[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [filteredUsers, setFilteredUsers] = useState(currentAccount.users);
  const [sortConfig, setSortConfig] = useState({ key: 'lastMessageAt', direction: 'desc' });

  const usersPerPage = 50;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    const filtered = currentAccount.users.filter(user =>
      (searchTerm === '' || user.displayName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || user.statusId === statusFilter) &&
      (tagFilter === '' || user.tags.includes(tagFilter)) &&
      (scenarioFilter === '' || user.scenarioId === scenarioFilter) &&
      (!dateRange.from || !dateRange.to || isWithinInterval(user.lastMessageAt, { start: dateRange.from, end: dateRange.to }))
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [currentAccount, searchTerm, statusFilter, tagFilter, scenarioFilter, dateRange]);

  const getCurrentUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const handleSort = (key: keyof User) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setFilteredUsers(prev => [...prev].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  const allTags = Array.from(new Set(currentAccount.users.flatMap(user => user.tags)));
  const allScenarios = Array.from(new Set(currentAccount.users.map(user => user.scenarioId)));

  const mockUser = {
    name: "テストユーザー",
    avatar: "/placeholder.svg?height=40&width=40",
    lineAccounts: lineAccounts.map(account => ({ id: account.id, name: account.accountName })),
    isAdmin: true,
  };

  return (
    <Layout user={mockUser}>
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="読者を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全てのステータス</SelectItem>
                <SelectItem value="active">アクティブ</SelectItem>
                <SelectItem value="inactive">非アクティブ</SelectItem>
                <SelectItem value="pending">保留中</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="タグ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全てのタグ</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="シナリオ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全てのシナリオ</SelectItem>
                {allScenarios.map(scenario => (
                  <SelectItem key={scenario} value={scenario}>{scenario}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "yyyy/MM/dd")} -{" "}
                        {format(dateRange.to, "yyyy/MM/dd")}
                      </>
                    ) : (
                      format(dateRange.from, "yyyy/MM/dd")
                    )
                  ) : (
                    "期間"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {(statusFilter || tagFilter || scenarioFilter || dateRange.from || dateRange.to) && (
              <Button variant="ghost" onClick={() => {
                setStatusFilter('');
                setTagFilter('');
                setScenarioFilter('');
                setDateRange({ from: undefined, to: undefined });
              }}>
                フィルタをクリア
              </Button>
            )}
          </div>
        </div>
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[250px]">名前</TableHead>
              <TableHead className="w-[180px]">
                <Button variant="ghost" onClick={() => handleSort('lastMessageAt')} className="font-bold">
                  最終メッセージ <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>タグ</TableHead>
              <TableHead className="w-[150px]">シナリオ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentUsers().map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.pictureUrl} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{user.displayName}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(user.lastMessageAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
                </TableCell>
                <TableCell>
                  <Badge variant={user.statusId === 'active' ? 'default' : user.statusId === 'inactive' ? 'secondary' : 'outline'}>
                    {user.statusId === 'active' ? 'アクティブ' : user.statusId === 'inactive' ? '非アクティブ' : '保留中'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {user.scenarioId}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            全 {filteredUsers.length} 件中 {(currentPage - 1) * usersPerPage + 1} - {Math.min(currentPage * usersPerPage, filteredUsers.length)} 件を表示
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              ページ {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}