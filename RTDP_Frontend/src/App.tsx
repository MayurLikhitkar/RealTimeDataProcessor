import './App.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { FaSyncAlt, FaDatabase } from 'react-icons/fa';
import type { LogResponse } from './types/types';
import api from './utils/api';
import DataLogs from './components/DataLogs';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

function App() {
  const queryClient = useQueryClient();

  // 1. Polling for real-time data simulation (Every 5 minutes)
  const { data, isLoading, isError, error } = useQuery<LogResponse>({
    queryKey: ['logs'],
    queryFn: async () => {
      const res = await api.get<LogResponse>('/dataLog');
      if (!res.data.success) {
        throw new Error(res.data.responseMessage || 'Failed to fetch logs');
      }
      return res.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.success && !isLoading) {
      toast.success(data.responseMessage, { id: 'logs-success' });
    }
  }, [data]);

  useEffect(() => {
    if (isError && error) {
      const message = isAxiosError(error)
        ? error.response?.data?.responseMessage || error.message
        : 'Failed to retrieve data logs';
      toast.error(message, { id: 'logs-error' });
    }
  }, [isError, error]);

  // 2. Seeding Data Logs
  const seedMutation = useMutation({
    mutationFn: async () => await api.post('/dataLog/seed'),
    onSuccess: () => {
      toast.success('Database seeded with 5000+ records!');
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.responseMessage || 'Failed to seed database');
        return;
      }
      toast.error('Failed to seed database')
    }
  });

  return (
    <div className="min-h-screen bg-background-main text-text-main font-sans p-8">
      <Toaster position="top-right" />

      <main className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary-main to-primary-dark bg-clip-text text-transparent">
              Scalable Real-Time Data Processor
            </h1>
            <p className="text-muted-main mt-1">Data Monitoring Dashboard</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-main text-text-inverse rounded hover:bg-primary-dark transition disabled:opacity-50"
            >
              <FaDatabase />
              {seedMutation.isPending ? 'Seeding...' : 'Seed 5k Records'}
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-background-light border rounded shadow-sm">
              <span className="w-2 h-2 rounded-full bg-success-main animate-pulse"></span>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-background-light p-4 rounded shadow border border-border-light">
            <h3 className="text-sm font-medium text-muted-main">Total Records</h3>
            <p className="text-2xl font-bold">{data?.count || 0}</p>
          </div>
          <div className="bg-background-light p-4 rounded shadow border border-border-light">
            <h3 className="text-sm font-medium text-muted-main">System Status</h3>
            <p className="text-2xl font-bold text-primary-main">OPTIMAL</p>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="bg-background-light p-1 rounded-lg shadow-lg border border-border-light">
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center text-muted-light">
              <FaSyncAlt className="animate-spin text-3xl" />
            </div>
          ) : isError ? (
            <div className="h-[500px] flex items-center justify-center text-error-main">
              Error connecting to API. Is backend running?
            </div>
          ) : (
            <DataLogs logs={data?.data || []} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App
