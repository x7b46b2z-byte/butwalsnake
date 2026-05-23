'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Users, Bug, BookOpen, TrendingUp, Clock, Loader, Activity, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

interface Stats {
  totalRescues: number;
  pendingRescues: number;
  completedRescues: number;
  activeRescues: number;
  totalVolunteers: number;
  pendingVolunteers: number;
  totalSpecies: number;
  totalBlogs: number;
}

const WEEK_DATA = [
  { day: 'Mon', rescues: 3 }, { day: 'Tue', rescues: 5 }, { day: 'Wed', rescues: 2 },
  { day: 'Thu', rescues: 7 }, { day: 'Fri', rescues: 4 }, { day: 'Sat', rescues: 6 }, { day: 'Sun', rescues: 1 },
];

const PIE_COLORS = ['#2ECC71', '#F39C12', '#3498DB', '#9B59B6', '#95A5A6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1215] border border-white/10 rounded-xl px-4 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-emerald-400 font-bold">{payload[0].value} rescues</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRescues, setRecentRescues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rescueRes, volunteerRes, speciesRes, blogRes] = await Promise.all([
          fetch('/api/rescue?limit=100'), fetch('/api/volunteer'), fetch('/api/species'), fetch('/api/blog?limit=10')
        ]);
        const [rescueData, volunteerData, speciesData, blogData] = await Promise.all([
          rescueRes.json(), volunteerRes.json(), speciesRes.json(), blogRes.json()
        ]);

        const rescues = rescueData.data || [];
        const volunteers = volunteerData.data || [];

        setStats({
          totalRescues: rescues.length,
          pendingRescues: rescues.filter((r: any) => r.status === 'PENDING').length,
          completedRescues: rescues.filter((r: any) => r.status === 'RESCUED' || r.status === 'CLOSED').length,
          activeRescues: rescues.filter((r: any) => r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS').length,
          totalVolunteers: volunteers.length,
          pendingVolunteers: volunteers.filter((v: any) => v.status === 'PENDING').length,
          totalSpecies: (speciesData.data || []).length,
          totalBlogs: blogData.total || 0,
        });

        setRecentRescues(rescues.slice(0, 5));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    ASSIGNED: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    IN_PROGRESS: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    RESCUED: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    CLOSED: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
  };

  const pieData = stats ? [
    { name: 'Completed/Closed', value: stats.completedRescues },
    { name: 'Pending', value: stats.pendingRescues },
    { name: 'Active/Assigned', value: stats.activeRescues },
  ] : [];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="flex flex-col items-center gap-3 text-gray-400"><Loader className="w-8 h-8 animate-spin text-emerald-400" /><p className="text-sm">Loading dashboard...</p></div></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-white">Dashboard Overview</h1><p className="text-gray-400 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rescues', value: stats?.totalRescues ?? 0, icon: AlertCircle, color: 'emerald', sub: `${stats?.activeRescues} active`, href: '/admin/rescues' },
          { label: 'Pending Rescues', value: stats?.pendingRescues ?? 0, icon: Clock, color: 'yellow', sub: 'Need attention', href: '/admin/rescues' },
          { label: 'Volunteers', value: stats?.totalVolunteers ?? 0, icon: Users, color: 'blue', sub: `${stats?.pendingVolunteers} pending`, href: '/admin/volunteers' },
          { label: 'Species in DB', value: stats?.totalSpecies ?? 0, icon: Bug, color: 'purple', sub: `${stats?.totalBlogs} blog posts`, href: '/admin/species' },
        ].map(({ label, value, icon: Icon, color, sub, href }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={href} className={`block glass-card rounded-2xl p-5 border border-white/10 hover:border-${color}-500/30 transition-all group`}>
              <div className="flex items-start justify-between mb-3"><div className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center`}><Icon className={`w-5 h-5 text-${color}-400`} /></div><ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" /></div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p><p className="text-gray-400 text-sm font-medium">{label}</p><p className="text-gray-600 text-xs mt-1">{sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6"><div><h3 className="text-white font-bold">Rescue Activity</h3><p className="text-gray-500 text-xs">This week's rescue requests</p></div><div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold"><TrendingUp className="w-4 h-4" /> Live</div></div>
          <ResponsiveContainer width="100%" height={200}><AreaChart data={WEEK_DATA}><defs><linearGradient id="rescueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} /><stop offset="95%" stopColor="#2ECC71" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" stroke="#374151" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis stroke="#374151" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} width={30} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="rescues" stroke="#2ECC71" strokeWidth={2} fill="url(#rescueGrad)" dot={{ fill: '#2ECC71', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#2ECC71' }} /></AreaChart></ResponsiveContainer>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-1">Rescue Status</h3><p className="text-gray-500 text-xs mb-4">Overall breakdown</p>
          <ResponsiveContainer width="100%" height={160}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} opacity={0.85} />)}</Pie><Tooltip formatter={(v: any, n: any) => [v, n]} contentStyle={{ background: '#0a1215', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} labelStyle={{ color: '#9CA3AF' }} itemStyle={{ color: '#fff' }} /></PieChart></ResponsiveContainer>
          <div className="space-y-2 mt-2">{pieData.map((item, i) => <div key={item.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} /><span className="text-gray-400">{item.name}</span></div><span className="text-white font-semibold">{item.value}</span></div>)}</div>
        </div>
      </div>
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5"><div className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" /><h3 className="text-white font-bold">Recent Rescue Requests</h3></div><Link href="/admin/rescues" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">View all →</Link></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">{['Caller', 'Phone', 'Municipality', 'Status', 'Time'].map(h => <th key={h} className="text-left text-gray-500 font-medium px-5 py-3 whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {recentRescues.length === 0 ? <tr><td colSpan={5} className="text-center text-gray-500 py-8">No rescue requests yet</td></tr> : recentRescues.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-5 py-3 text-gray-400 font-mono whitespace-nowrap">{r.phone}</td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{r.municipality}</td>
                  <td className="px-5 py-3 whitespace-nowrap"><span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[r.status] || STATUS_COLORS.CLOSED}`}>{r.status}</span></td>
                  <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Manage Rescues', href: '/admin/rescues', icon: AlertCircle, color: 'red' },
          { label: 'Approve Volunteers', href: '/admin/volunteers', icon: Users, color: 'blue' },
          { label: 'Snake Database', href: '/admin/species', icon: Bug, color: 'emerald' },
          { label: 'Blog Management', href: '/admin/blog', icon: BookOpen, color: 'purple' },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link key={href} href={href} className={`glass-card rounded-xl p-4 border border-white/10 hover:border-${color}-500/30 transition-all flex items-center gap-3 group`}><Icon className={`w-5 h-5 text-${color}-400 group-hover:scale-110 transition-transform`} /><span className="text-white text-sm font-medium">{label}</span></Link>
        ))}
      </div>
    </div>
  );
}
