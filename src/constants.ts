import { Kiosk } from './types';

export const MOCK_KIOSKS: Kiosk[] = [
  {
    id: '1',
    ownerId: 'owner1',
    title: 'Kiosk Strategis Depan Kampus UNESA',
    description: 'Lokasi sangat ramai, cocok untuk jualan minuman atau pulsa. Berada tepat di jalur pejalan kaki mahasiswa yang menuju halte bus. Akses mudah dari berbagai arah.',
    price: 1500000,
    address: 'Jl. Lidah Wetan No. 12, Surabaya',
    location: { lat: -7.306, lng: 112.675 },
    photos: [
      'https://picsum.photos/seed/k1/800/600',
      'https://picsum.photos/seed/k1_2/800/600',
      'https://picsum.photos/seed/k1_3/800/600'
    ],
    facilities: ['Listrik 1300W', 'Air Bersih', 'Wifi', 'CCTV'],
    status: 'available',
    strategicData: {
      traffic: 'High',
      density: 'High',
      proximity: ['Kampus UNESA', 'Pakuwon Mall', 'Apartemen Anderson'],
      analysis: 'Lokasi ini memiliki traffic pejalan kaki yang sangat tinggi karena berada tepat di gerbang utama kampus. Sangat potensial untuk bisnis F&B atau Laundry.'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    ownerId: 'owner2',
    title: 'Ruko Minimalis Dekat Perkantoran Sudirman',
    description: 'Cocok untuk cafe kecil atau laundry express. Area dengan perkantoran padat dan hunian vertikal.',
    price: 3500000,
    address: 'Jl. Jend. Sudirman No. 45, Jakarta',
    location: { lat: -6.214, lng: 106.827 },
    photos: [
      'https://picsum.photos/seed/k2/800/600',
      'https://picsum.photos/seed/k2_2/800/600'
    ],
    facilities: ['CCTV', 'Parkir Luas', 'AC', 'Security 24 Jam'],
    status: 'available',
    strategicData: {
      traffic: 'Medium',
      density: 'Medium',
      proximity: ['BCA Tower', 'Stasiun Sudirman', 'Grand Indonesia'],
      analysis: 'Keunggulan utama adalah kedekatan dengan pusat perkantoran elit. Target market ideal adalah karyawan kantor yang mencari kenyamanan dan kecepatan.'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    ownerId: 'owner3',
    title: 'Kios Pujasera Food Court ITC Mangga Dua',
    description: 'Sudah termasuk meja kursi, siap jualan makanan langsung hari ini!',
    price: 1200000,
    address: 'ITC Mangga Dua Lt. 4, Jakarta',
    location: { lat: -6.135, lng: 106.833 },
    photos: ['https://picsum.photos/seed/k3/800/600'],
    facilities: ['Meja Kursi', 'Gas Sentral', 'Listrik 2200W'],
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
