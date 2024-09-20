// app/[accountId]/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { LineAccount, Scenario } from '@/types/models';

interface ScenarioData {
  name: string;
  messages: {
    order: number;
    sent: number;
    openRate: string;
  }[];
}

interface KPIData {
  friendsAdded: number;
  cpa: number;
  currentSales: number;
  profit: number;
}

export default function DashboardPage() {
  const { accountId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioData[]>([]);

  useEffect(() => {
    if (!accountId) return;

    const fetchData = async () => {
      // KPIデータを取得するロジックをここに実装
      const accountRef = doc(db, 'lineAccounts', accountId);
      const accountSnap = await getDoc(accountRef);
      if (accountSnap.exists()) {
        const accountData = accountSnap.data() as LineAccount;
        // KPIデータの処理を実装（例）
        const calculatedKPIData: KPIData = {
          friendsAdded: accountData.totalFriendsAdded || 0,
          cpa: accountData.totalCPA || 0,
          currentSales: accountData.currentSales || 0,
          profit: accountData.profit || 0,
        };
        setKpiData(calculatedKPIData);
      }

      // シナリオデータを取得
      const scenariosRef = collection(db, 'lineAccounts', accountId, 'scenarios');
      const scenariosSnap = await getDocs(scenariosRef);
      const scenarios = scenariosSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Scenario),
      }));

      if (scenarios.length > 0) {
        const processedScenarioData = scenarios.map((scenario) => ({
          name: scenario.name,
          messages: scenario.messages.map((message: any, index: number) => ({
            order: index + 1,
            sent: message.sentCount,
            openRate: `${message.openRate}%`,
          })),
        }));
        setScenarioData(processedScenarioData);
      }
    };

    fetchData();
  }, [accountId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50 p-6">
      {/* フィルターバー */}
      <div className="mb-6">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="表示期間" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">当日</SelectItem>
            <SelectItem value="week">1週間</SelectItem>
            <SelectItem value="month">1ヶ月</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIサマリー */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>友達追加</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpiData.friendsAdded}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>CPA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpiData.cpa}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>現在の売上</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpiData.currentSales}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>利益</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpiData.profit}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* シナリオ開封率テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>シナリオの開封数・開封率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>シナリオ名</TableHead>
                  <TableHead>1通目 / 開封率</TableHead>
                  <TableHead>2通目 / 開封率</TableHead>
                  <TableHead>3通目 / 開封率</TableHead>
                  {/* 必要に応じて列を追加 */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarioData.map((scenario, index) => (
                  <TableRow key={index}>
                    <TableCell>{scenario.name}</TableCell>
                    {scenario.messages.map((message, idx) => (
                      <TableCell key={idx}>
                        {message.sent} / {message.openRate}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
