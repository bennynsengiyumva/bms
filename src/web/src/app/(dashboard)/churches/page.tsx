'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { api } from '@/lib/api';
import { ChurchHierarchy } from './components/ChurchHierarchy';
import { ChurchStats } from './components/ChurchStats';
import { ChurchProfile } from './components/ChurchProfile';
import { ChurchCommunication } from './components/ChurchCommunication';

export default function ChurchesPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    hierarchy: [],
    stats: null,
    messages: [],
    churches: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [hierarchy, stats, messages, churches] = await Promise.all([
          api.churches.getHierarchy(),
          api.churches.getStats(),
          api.churches.getMessages(),
          api.churches.getAll()
        ]);

        setData({
          hierarchy,
          stats,
          messages,
          churches
        });
      } catch (error) {
        console.error('Error fetching church data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSendMessage = async (msg: any) => {
    try {
      await api.churches.sendMessage(msg);
      // Refresh messages
      const updatedMessages = await api.churches.getMessages();
      setData({ ...data, messages: updatedMessages });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSaveProfile = async (profile: any) => {
    try {
      // In a real app, this would be api.churches.create/update
      console.log('Saving profile:', profile);
      // For now just refresh the list
      const updatedChurches = await api.churches.getAll();
      setData({ ...data, churches: updatedChurches });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.churches.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.churches.subtitle}
          </p>
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="directory">{t.churches.directoryTab}</TabsTrigger>
          <TabsTrigger value="stats">{t.churches.statsTab}</TabsTrigger>
          <TabsTrigger value="communication">{t.churches.communicationTab}</TabsTrigger>
          <TabsTrigger value="profile">{t.churches.profileTab}</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-4 space-y-6">
            <ChurchHierarchy data={data.hierarchy} />
          </div>
          
          <div className="lg:col-span-8">
            <TabsContent value="directory">
              <div className="space-y-6">
                <ChurchStats data={data.stats} />
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">{t.churches.churchList}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px]">
                        <tr>
                          <th className="px-4 py-2">{t.common.name}</th>
                          <th className="px-4 py-2">{t.common.type}</th>
                          <th className="px-4 py-2">{t.churches.district}</th>
                          <th className="px-4 py-2">{t.common.status}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.churches.map((c: any) => (
                          <tr key={c.id}>
                            <td className="px-4 py-2 font-medium">{c.name}</td>
                            <td className="px-4 py-2 capitalize">{c.type}</td>
                            <td className="px-4 py-2">{c.districtName || 'N/A'}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <ChurchStats data={data.stats} />
            </TabsContent>

            <TabsContent value="communication">
              <ChurchCommunication 
                messages={data.messages} 
                onSendMessage={handleSendMessage} 
              />
            </TabsContent>

            <TabsContent value="profile">
              <ChurchProfile onSave={handleSaveProfile} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
