import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../lib/utils';

interface TaskSummary {
  total: number;
  completed: number;
  inProgress: number;
}

interface AttendanceRecord {
  date: string;
  check_in: string;
  check_out: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
    total: 0,
    completed: 0,
    inProgress: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>(
    []
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      // Fetch task summary
      const { data: tasks } = await supabase
        .from('tasks')
        .select('status')
        .eq('assigned_to', user.id);

      if (tasks) {
        const summary = tasks.reduce(
          (acc, task) => {
            acc.total++;
            if (task.status === 'completed') acc.completed++;
            if (task.status === 'in_progress') acc.inProgress++;
            return acc;
          },
          { total: 0, completed: 0, inProgress: 0 }
        );
        setTaskSummary(summary);
      }

      // Fetch recent attendance
      const { data: attendance } = await supabase
        .from('attendance')
        .select('date, check_in, check_out')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (attendance) {
        setRecentAttendance(attendance);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Task Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {taskSummary.total}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Completed Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {taskSummary.completed}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {taskSummary.inProgress}
          </p>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Attendance
          </h2>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAttendance.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.check_in).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.check_out
                        ? new Date(record.check_out).toLocaleTimeString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
