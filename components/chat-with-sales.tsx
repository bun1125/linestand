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

export function ChatWithSales() {
  const [selectedUser, setSelectedUser] = React.useState('Sarah Howard')
  const [inputMessage, setInputMessage] = React.useState('')
  const [newTag, setNewTag] = React.useState('')
  const [selectedTemplateTags, setSelectedTemplateTags] = React.useState<string[]>([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [textareaHeight, setTextareaHeight] = React.useState(40)
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)

  const statusOptions = ['New Customer', 'VIP Customer', 'Returning Customer', 'Potential Lead', '成約']

  const [users, setUsers] = useState([
    {
      name: 'Rebecca Dixon',
      status: 'VIP Customer',
      tags: ['Interested in Product A', 'High Spender'],
      avatar: '/placeholder.svg?height=100&width=100',
      messages: [
        { id: 1, sender: 'Rebecca Dixon', content: 'Hello, I\'m interested in your new product line.', time: '10:30 am' },
        { id: 2, sender: 'User', content: 'Great! I\'d be happy to tell you more about it.', time: '10:32 am' },
      ],
      memo: 'Prefers email communication. Follow up next week about new product launch.',
      lastMessageTime: new Date('2023-09-03T10:32:00'),
      isPinned: false,
      favorability: 75,
      sales: 0
    },
    {
      name: 'Sarah Howard',
      status: 'New Customer',
      tags: ['First Purchase', 'Newsletter Subscriber'],
      avatar: '/placeholder.svg?height=100&width=100',
      messages: [
        { id: 1, sender: 'Sarah Howard', content: 'We have available rooms from 25 to 30 August in downtown. If that works good I can send photos and give detailed information about room.', time: '13:45' },
        { id: 2, sender: 'User', content: 'Oh! That's great. 🙌', time: '13:46' },
        { id: 3, sender: 'Sarah Howard', content: 'Wishing you from you, Thanks', time: '13:47' },
        { id: 4, sender: 'User', content: 'Here is some pictures', time: '13:48' },
      ],
      memo: 'Interested in summer promotions. Send welcome package.',
      lastMessageTime: new Date('2023-09-03T13:48:00'),
      isPinned: true,
      favorability: 100,
      sales: 0
    },
    {
      name: 'Stephen Wagner',
      status: 'Returning Customer',
      tags: ['Prefers Email', 'Interested in Discounts'],
      avatar: '/placeholder.svg?height=100&width=100',
      messages: [
        { id: 1, sender: 'Stephen Wagner', content: 'Do you have any ongoing promotions?', time: '15:20 pm' },
        { id: 2, sender: 'User', content: 'Yes, we currently have a summer sale going on!', time: '15:22 pm' },
      ],
      memo: 'Regular buyer. Offer loyalty program benefits.',
      lastMessageTime: new Date('2023-09-03T15:22:00'),
      isPinned: false,
      favorability: 50,
      sales: 0
    },
    {
      name: 'Katie Barnes',
      status: 'Potential Lead',
      tags: ['Requested Callback', 'Product Inquiry'],
      avatar: '/placeholder.svg?height=100&width=100',
      messages: [
        { id: 1, sender: 'Katie Barnes', content: 'Can someone call me to discuss your services?', time: '11:05 am' },
        { id: 2, sender: 'User', content: 'What would be the best time to reach you?', time: '11:07 am' },
      ],
      memo: 'Schedule follow-up call for next Tuesday at 2 PM.',
      lastMessageTime: new Date('2023-09-03T11:07:00'),
      isPinned: false,
      favorability: 25,
      sales: 0
    },
  ])

  const templateMessages = [
    { id: 1, content: "Welcome! How can I assist you today?", tags: ["New Customer"] },
    { id: 2, content: "Thank you for your interest in our product. Would you like more information?", tags: ["Product Inquiry"] },
    { id: 3, content: "We currently have a special discount offer. Would you like to know more?", tags: ["Interested in Discounts"] },
    { id: 4, content: "Is there a convenient time for us to call you back?", tags: ["Requested Callback"] },
    { id: 5, content: "As a VIP customer, you have access to exclusive offers. Let me know if you're interested!", tags: ["VIP Customer"] },
  ]

  const [selectedUserData, setSelectedUserData] = React.useState(users.find(user => user.name === selectedUser) || users[0])

  React.useEffect(() => {
    setSelectedUserData(users.find(user => user.name === selectedUser) || users[0])
  }, [selectedUser, users])

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
  }, [selectedUserData.messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        id: selectedUserData.messages.length + 1,
        sender: 'User',
        content: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setSelectedUserData(prevData => ({
        ...prevData,
        messages: [...prevData.messages, newMessage],
        lastMessageTime: new Date()
      }))
      setUsers(prevUsers => prevUsers.map(user => 
        user.name === selectedUserData.name 
          ? { ...user, messages: [...user.messages, newMessage], lastMessageTime: new Date() }
          : user
      ))
      setInputMessage('')
      setSelectedTemplateTags([])
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() !== '' && !selectedUserData.tags.includes(newTag.trim())) {
      const updatedTags = [...selectedUserData.tags, newTag.trim()]
      setSelectedUserData(prevData => ({
        ...prevData,
        tags: updatedTags
      }))
      setUsers(prevUsers => prevUsers.map(user => 
        user.name === selectedUserData.name 
          ? { ...user, tags: updatedTags }
          : user
      ))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedUserData.tags.filter(tag => tag !== tagToRemove)
    setSelectedUserData(prevData => ({
      ...prevData,
      tags: updatedTags
    }))
    setUsers(prevUsers => prevUsers.map(user => 
      user.name === selectedUserData.name 
        ? { ...user, tags: updatedTags }
        : user
    ))
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

  const handleStatusChange = (newStatus: string) => {
    setSelectedUserData(prevData => ({
      ...prevData,
      status: newStatus
    }))
    setUsers(prevUsers => prevUsers.map(user => 
      user.name === selectedUserData.name 
        ? { ...user, status: newStatus }
        : user
    ))
  }

  const handleMemoChange = (newMemo: string) => {
    setSelectedUserData(prevData => ({
      ...prevData,
      memo: newMemo
    }))
    setUsers(prevUsers => prevUsers.map(user => 
      user.name === selectedUserData.name 
        ? { ...user, memo: newMemo }
        : user
    ))
  }

  const handleTogglePin = (userName: string) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.name === userName 
        ? { ...user, isPinned: !user.isPinned }
        : user
    ))
    if (userName === selectedUserData.name) {
      setSelectedUserData(prevData => ({
        ...prevData,
        isPinned: !prevData.isPinned
      }))
    }
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSalesChange = (value: string) => {
    const salesValue = value === '' ? 0 : parseInt(value, 10)
    setSelectedUserData(prevData => ({
      ...prevData,
      sales: salesValue
    }))
    setUsers(prevUsers => prevUsers.map(user => 
      user.name === selectedUserData.name 
        ? { ...user, sales: salesValue }
        : user
    ))
  }

  const filteredUsers = users.filter(user => 
    (searchTerm === '' || user.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatuses.length === 0 || selectedStatuses.includes(user.status)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => user.tags.includes(tag)))
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
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
        {sortedUsers.map((user, index) => (
          <div
            key={index}
            className={`flex items-start p-4 hover:bg-gray-100 cursor-pointer ${selectedUser === user.name ? 'bg-gray-100' : ''}`}
            onClick={() => {
              setSelectedUser(user.name)
              setLeftSidebarOpen(false)
            }}
          >
            <div className="relative mr-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {user.isPinned && (
                <Pin className="h-4 w-4 text-blue-500 absolute -top-1 -left-1 bg-white rounded-full" />
              )}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-lg">
                {renderFavorabilityHeart(user.favorability)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold truncate">{user.name}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {user.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {user.messages[user.messages.length - 1].content}
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
              <AvatarImage src={selectedUserData.avatar} alt={selectedUserData.name} />
              <AvatarFallback>{selectedUserData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{selectedUserData.name}</h3>
            <div className="w-full mt-2 flex items-center space-x-2">
              <Select value={selectedUserData.status} onValueChange={handleStatusChange}>
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
              {selectedUserData.status === '成約' && (
                <Input
                  type="number"
                  placeholder="売上"
                  value={selectedUserData.sales === 0 ? '' : selectedUserData.sales.toString()}
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
              value={selectedUserData.memo}
              onChange={(e) => handleMemoChange(e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Tags</h4>
            <div className="flex flex-col gap-2 mb-2">
              {selectedUserData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-300 justify-between">
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

  return (
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
              <AvatarImage src={selectedUserData.avatar} alt={selectedUserData.name} />
              <AvatarFallback>{selectedUserData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedUserData.name}</h2>
              <p className="text-sm text-gray-500">Active 1h ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleTogglePin(selectedUserData.name)}>
              <Pin className={`h-6 w-6 ${selectedUserData.isPinned ? 'text-blue-500' : 'text-gray-500'}`} />
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
          {selectedUserData.messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'} mb-4 items-end`}>
              {message.sender === 'User' && (
                <span className="text-xs text-gray-400 mr-2">{message.time}</span>
              )}
              <div className={`max-w-[70%] ${message.sender === 'User' ? 'bg-[#c9f7c9] text-black' : 'bg-gray-200'} rounded-2xl px-4 py-2`}>
                <p>{message.content}</p>
              </div>
              {message.sender !== 'User' && (
                <span className="text-xs text-gray-400 ml-2">{message.time}</span>
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
  )
}