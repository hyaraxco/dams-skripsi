import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../lib/utils';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in: string;
  check_out: string | null;
}

export default function Attendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching attendance:', error);
      } else {
        setAttendance(data || []);
        // Check if already checked in today
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = data?.find((record) => record.date === today);
        setCheckedIn(!!todayRecord && !todayRecord.check_out);
      }
      setLoading(false);
    };

    fetchAttendance();
  }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;

    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const { error } = await supabase.from('attendance').insert([
      {
        user_id: user.id,
        date: today,
        check_in: now,
      },
    ]);

    if (error) {
      console.error('Error checking in:', error);
    } else {
      setCheckedIn(true);
      // Refresh attendance list
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      setAttendance(data || []);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find((record) => record.date === today);

    if (todayRecord) {
      const { error } = await supabase
        .from('attendance')
        .update({ check_out: new Date().toISOString() })
        .eq('id', todayRecord.id);

      if (error) {
        console.error('Error checking out:', error);
      } else {
        setCheckedIn(false);
        // Refresh attendance list
        const { data } = await supabase
          .from('attendance')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        setAttendance(data || []);
      }
    }
  };

  if (loading) {
    return <div>Loading attendance records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <button
          onClick={checkedIn ? handleCheckOut : handleCheckIn}
          className={`px-4 py-2 rounded-md text-white ${
            checkedIn
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {checkedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance.map((record) => {
              const duration = record.check_out
                ? new Date(record.check_out).getTime() -
                  new Date(record.check_in).getTime()
                : null;
              const hours = duration
                ? Math.floor(duration / (1000 * 60 * 60))
                : null;
              const minutes = duration
                ? Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
                : null;

              return (
                <tr key={record.id}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hours !== null && minutes !== null
                      ? `${hours}h ${minutes}m`
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
