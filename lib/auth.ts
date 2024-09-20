export const getCurrentUser = () => {
  // 実際のユーザー取得ロジックをここに実装
  return {
    name: 'テストユーザー',
    avatar: '/path/to/avatar.jpg',
    lineAccounts: [{ id: '1', name: 'アカウント1' }],
    isAdmin: false,
  }
}