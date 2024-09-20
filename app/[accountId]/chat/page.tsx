// app/[accountId]/chat/page.tsx

'use client'

import React, { KeyboardEvent, useRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, MoreHorizontal, Paperclip, Send, Search, X, Smile, Sparkles, Heart, Pin, Filter, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { useUsers } from "@/hooks/useUsers"
import { useMessages } from "@/hooks/useMessages"
import { sendMessage, addTag, removeTag, updateStatus, updateMemo, togglePin, updateSales } from "@/services/firestore"

import { LineAccount, User, Message } from "@/types/models"
import Layout from "@/app/layout"

import { useContext } from "react"
import { AccountContext } from "@/context/AccountContext"

export default function ChatPage() {
  const { currentAccount } = useContext(AccountContext) // アカウント情報を取得
  const lineAccountId = currentAccount?.id || ''

  const { users, loading: usersLoading, error: usersError } = useUsers(lineAccountId)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const selectedUser = users.find(user => user.id === selectedUserId) || users[0]

  const { messages, loading: messagesLoading, error: messagesError } = useMessages(lineAccountId, selectedUserId)

  const [inputMessage, setInputMessage] = useState('')
  const [newTag, setNewTag] = useState('')
  const [selectedTemplateTags, setSelectedTemplateTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [textareaHeight, setTextareaHeight] = useState(40)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)

  const statusOptions = ['New Customer', 'VIP Customer', 'Returning Customer', 'Potential Lead', '成約']

  const templateMessages = [
    { id: 1, content: "Welcome! How can I assist you today?", tags: ["New Customer"] },
    { id: 2, content: "Thank you for your interest in our product. Would you like more information?", tags: ["Product Inquiry"] },
    { id: 3, content: "We currently have a special discount offer. Would you like to know more?", tags: ["Interested in Discounts"] },
    { id: 4, content: "Is there a convenient time for us to call you back?", tags: ["Requested Callback"] },
    { id: 5, content: "As a VIP customer, you have access to exclusive offers. Let me know if you're interested!", tags: ["VIP Customer"] },
  ]

  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id)
    }
  }, [users, selectedUserId])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      setTextareaHeight(textareaRef.current.scrollHeight)
    }
  }, [inputMessage])

  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !lineAccountId || !selectedUserId) return

    const newMessage: Omit<Message, 'id'> = {
      type: 'text',
      content: { text: inputMessage },
      direction: 'outgoing',
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
    }

    try {
      await sendMessage(lineAccountId, selectedUserId, newMessage)
      setInputMessage('')
      setSelectedTemplateTags([])
    } catch (error) {
      console.error("メッセージの送信に失敗しました:", error)
    }
  }

  const handleAddTag = async () => {
    if (newTag.trim() === '' || !lineAccountId || !selectedUserId) return

    try {
      await addTag(lineAccountId, selectedUserId, newTag.trim())
      setNewTag('')
    } catch (error) {
      console.error("タグの追加に失敗しました:", error)
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!lineAccountId || !selectedUserId) return

    try {
      await removeTag(lineAccountId, selectedUserId, tagToRemove)
    } catch (error) {
      console.error("タグの削除に失敗しました:", error)
    }
  }

  const handleTemplateSelect = (template: { content: string, tags: string[] }) => {
    setInputMessage(template.content)
    setSelectedTemplateTags(template.tags)
  }

  const handleRemoveTemplateTag = (tagToRemove: string) => {
    setSelectedTemplateTags(prevTags => prevTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleStatusChange = async (newStatusId: string) => {
    if (!lineAccountId || !selectedUserId) return

    try {
      await updateStatus(lineAccountId, selectedUserId, newStatusId)
    } catch (error) {
      console.error("ステータスの更新に失敗しました:", error)
    }
  }

  const handleMemoChange = async (newMemo: string) => {
    if (!lineAccountId || !selectedUserId) return

    try {
      await updateMemo(lineAccountId, selectedUserId, newMemo)
    } catch (error) {
      console.error("メモの更新に失敗しました:", error)
    }
  }

  const handleTogglePin = async () => {
    if (!lineAccountId || !selectedUserId) return

    try {
      await togglePin(lineAccountId, selectedUserId, !selectedUser.pin)
    } catch (error) {
      console.error("ピンの切り替えに失敗しました:", error)
    }
  }

  const handleSalesChange = async (value: string) => {
    if (!lineAccountId || !selectedUserId) return

    const salesValue = value === '' ? 0 : parseInt(value, 10)

    try {
      await updateSales(lineAccountId, selectedUserId, salesValue)
    } catch (error) {
      console.error("売上の更新に失敗しました:", error)
    }
  }

  const handleStatusFilter = (statusId: string) => {
    setSelectedStatuses(prev =>
      prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId]
    )
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredUsers = users.filter(user =>
    (searchTerm === '' || user.displayName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatuses.length === 0 || selectedStatuses.includes(user.statusId)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => user.tags.includes(tag)))
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.pin && !b.pin) return -1
    if (!a.pin && b.pin) return 1
    const aTime = a.lastMessageAt?.toDate().getTime() || 0
    const bTime = b.lastMessageAt?.toDate().getTime() || 0
    return bTime - aTime
  })

  const renderFavorabilityHeart = (favorability: number) => {
    const fullHeart = '❤️'
    const emptyHeart = '🤍'
    const quarterHeart = '💔'
    const halfHeart = '💖'
    const threeQuarterHeart = '💗'

    if (favorability === 100) return fullHeart
    if (favorability >= 75) return threeQuarterHeart
    if (favorability >= 50) return halfHeart
    if (favorability >= 25) return quarterHeart
    return emptyHeart
  }

  const allTags = Array.from(new Set(users.flatMap(user => user.tags)))

  const LeftSidebar = () => (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="relative flex items-center">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  {statusOptions.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => handleStatusFilter(status)}
                      />
                      <Label htmlFor={`status-${status}`}>{status}</Label>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagFilter(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-start p-4 hover:bg-gray-100 cursor-pointer ${selectedUserId === user.id ? 'bg-gray-100' : ''}`}
            onClick={() => setSelectedUserId(user.id)}
          >
            <div className="relative mr-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.pictureUrl} alt={user.displayName} />
                <AvatarFallback>{user.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {user.pin && (
                <Pin className="h-4 w-4 text-blue-500 absolute -top-1 -left-1 bg-white rounded-full" />
              )}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-lg">
                {renderFavorabilityHeart(user.favorability)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold truncate">{user.displayName}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {user.lastMessageAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {messages[messages.length - 1]?.content.text}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )

  const RightSidebar = () => (
    <div className="w-full h-full bg-white flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex flex-col items-center mb-4">
            <Avatar className="w-24 h-24 mb-2">
              <AvatarImage src={selectedUser?.pictureUrl} alt={selectedUser?.displayName} />
              <AvatarFallback>{selectedUser?.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{selectedUser?.displayName}</h3>
            <div className="w-full mt-2 flex items-center space-x-2">
              <Select value={selectedUser?.statusId || ''} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUser?.statusId === '成約' && (
                <Input
                  type="number"
                  placeholder="売上"
                  value={selectedUser?.sales === 0 ? '' : selectedUser.sales.toString()}
                  onChange={(e) => handleSalesChange(e.target.value)}
                  className="w-1/2"
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Memo</h4>
            <Textarea
              placeholder="Add a memo..."
              value={selectedUser?.notes || ''}
              onChange={(e) => handleMemoChange(e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Tags</h4>
            <div className="flex flex-col gap-2 mb-2">
              {selectedUser?.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-300 justify-between">
                  {tag}
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1 text-blue-600 hover:text-blue-700 hover:bg-blue-200" onClick={() => handleRemoveTag(tag)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="New tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1"
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="font-semibold mb-2">Template Messages</h4>
            <ScrollArea className="h-40 w-full">
              <div className="flex flex-col space-y-2 pb-4">
                {templateMessages.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="justify-start text-left h-auto whitespace-normal"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template.content}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <Separator className="my-4" />
          <div>
            <Button
              className="w-full text-white relative overflow-hidden group"
              style={{
                background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
                backgroundSize: '400% 400%',
                animation: 'gradient 15s ease infinite',
              }}
              onClick={() => setInputMessage("AI generated message will appear here")}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Message
              </span>
              <span
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
                  backgroundSize: '400% 400%',
                  animation: 'gradient 15s ease infinite',
                }}
              />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )

  if (usersLoading || messagesLoading) {
    return <div>Loading...</div>
  }

  if (usersError || messagesError) {
    return <div>Error loading data.</div>
  }

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        {/* Left sidebar */}
        <div className="hidden md:block w-1/4 bg-white border-r">
          <LeftSidebar />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <LeftSidebar />
                </SheetContent>
              </Sheet>
              <Avatar>
                <AvatarImage src={selectedUser?.pictureUrl} alt={selectedUser?.displayName} />
                <AvatarFallback>{selectedUser?.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedUser?.displayName}</h2>
                <p className="text-sm text-gray-500">Active 1h ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleTogglePin}>
                <Pin className={`h-6 w-6 ${selectedUser?.pin ? 'text-blue-500' : 'text-gray-500'}`} />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <MoreHorizontal className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <RightSidebar />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4" ref={chatScrollAreaRef}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'} mb-4 items-end`}>
                {message.direction === 'outgoing' && (
                  <span className="text-xs text-gray-400 mr-2">
                    {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <div className={`max-w-[70%] ${message.direction === 'outgoing' ? 'bg-[#c9f7c9] text-black' : 'bg-gray-200'} rounded-2xl px-4 py-2`}>
                  <p>{message.content.text}</p>
                </div>
                {message.direction !== 'outgoing' && (
                  <span className="text-xs text-gray-400 ml-2">
                    {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            ))}
          </ScrollArea>

          {/* Selected template tags */}
          {selectedTemplateTags.length > 0 && (
            <div className="bg-gray-100 p-2 flex flex-wrap gap-2 border border-gray-200 mx-4 rounded-t-md">
              {selectedTemplateTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-300">
                  {tag}
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1 text-blue-600 hover:text-blue-700 hover:bg-blue-200" onClick={() => handleRemoveTemplateTag(tag)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Chat input */}
          <div className="bg-white p-4 border-t flex items-center space-x-2" style={{ minHeight: `${textareaHeight + 32}px` }}>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Smile className="h-6 w-6" />
            </Button>
            <Textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 resize-none overflow-hidden"
              style={{
                height: `${textareaHeight}px`,
                minHeight: '40px',
                maxHeight: '200px',
              }}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden md:block w-1/4 bg-white border-l">
          <RightSidebar />
        </div>
        <style jsx>{`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </div>
    </Layout>
  )
}
