'use client';

import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const LaporanKinerjaPage = () => {
  const [certificatesData, setCertificatesData] = useState<{ date: string; count: number }[]>([]);
  const [eventsData, setEventsData] = useState<{ title: string; startDate: string }[]>([]);
  const [tugasData, setTugasData] = useState<{ judul: string; deadline: string }[]>([]);
  const [usersData, setUsersData] = useState<{ firstName: string; lastName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch certificates
        const certificatesResponse = await fetch('/api/certificates');
        const certificates = await certificatesResponse.json();
        const groupedCertificates = certificates.reduce((acc: { [key: string]: number }, certificate: { date: string }) => {
          const date = new Date(certificate.date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        const formattedCertificates = Object.keys(groupedCertificates).map((date) => ({
          date,
          count: groupedCertificates[date],
        }));
        setCertificatesData(formattedCertificates);

        // Fetch events
        const eventsResponse = await fetch('/api/events');
        const events = await eventsResponse.json();
        setEventsData(events);

        // Fetch tugas
        const tugasResponse = await fetch('/api/tugas');
        const tugas = await tugasResponse.json();
        setTugasData(tugas);

        // Fetch users
        const usersResponse = await fetch('/api/users');
        const users = await usersResponse.json();
        setUsersData(users);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data for certificates (Bar Chart)
  const certificatesChartData = {
    labels: certificatesData.map((item) => item.date),
    datasets: [
      {
        label: 'Jumlah Sertifikat',
        data: certificatesData.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for events (Bar Chart)
  const eventsChartData = {
    labels: eventsData.map((event) => event.title),
    datasets: [
      {
        label: 'Jumlah Peserta',
        data: eventsData.map(() => Math.floor(Math.random() * 100)), // Contoh data acak
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for tugas (Pie Chart)
  const tugasChartData = {
    labels: tugasData.map((tugas) => tugas.judul),
    datasets: [
      {
        label: 'Status Tugas',
        data: tugasData.map(() => Math.floor(Math.random() * 50)), // Contoh data acak
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Jumlah Sertifikat per Hari',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribusi Status Tugas',
      },
    },
  };

  if (loading) {
    return <p className="text-center text-lg">Memuat data...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Kinerja</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Certificates Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sertifikat</h2>
          <Bar data={certificatesChartData} options={barChartOptions} />
        </div>

        {/* Events Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Events</h2>
          <Bar data={eventsChartData} options={barChartOptions} />
        </div>

        {/* Tugas Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tugas</h2>
          <Pie data={tugasChartData} options={pieChartOptions} />
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pengguna</h2>
          <ul>
            {usersData.slice(0, 5).map((user, index) => (
              <li key={index} className="mb-2">
                <span className="font-medium">{user.firstName} {user.lastName}</span>
              </li>
            ))}
          </ul>
          {usersData.length > 5 && (
            <p className="text-sm text-gray-600">+ {usersData.length - 5} pengguna lainnya...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaporanKinerjaPage;