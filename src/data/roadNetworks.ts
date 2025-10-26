// Şehir bazlı gerçek yol ağları

export interface RoadData {
  name: string;
  start: [number, number];
  end: [number, number];
  baseFlow: number;
}

export const ankaraRoads: RoadData[] = [
  { name: "Atatürk Bulvarı", start: [39.9208, 32.8541], end: [39.9334, 32.8597], baseFlow: 75 },
  { name: "Eskişehir Yolu", start: [39.9334, 32.8597], end: [39.9500, 32.7800], baseFlow: 70 },
  { name: "Konya Yolu", start: [39.8800, 32.8597], end: [39.8500, 32.8800], baseFlow: 65 },
  { name: "İstanbul Yolu (D-750)", start: [39.9334, 32.8597], end: [40.0000, 32.9000], baseFlow: 80 },
  { name: "Tunus Caddesi", start: [39.9100, 32.8500], end: [39.9200, 32.8650], baseFlow: 60 },
  { name: "Çankaya Caddesi", start: [39.9100, 32.8600], end: [39.9000, 32.8700], baseFlow: 55 },
  { name: "Dikimevi Kavşağı", start: [39.9334, 32.8597], end: [39.9400, 32.8700], baseFlow: 72 },
  { name: "Kızılay - Sıhhiye Hattı", start: [39.9200, 32.8540], end: [39.9334, 32.8650], baseFlow: 78 },
  { name: "Tunalı Hilmi Caddesi", start: [39.9150, 32.8480], end: [39.9250, 32.8550], baseFlow: 68 },
  { name: "Gazi Mustafa Kemal Bulvarı", start: [39.9500, 32.8500], end: [39.9700, 32.8600], baseFlow: 73 },
  { name: "Cemal Gürsel Caddesi", start: [39.9000, 32.8500], end: [39.9100, 32.8600], baseFlow: 58 },
  { name: "İnönü Bulvarı", start: [39.9250, 32.8500], end: [39.9350, 32.8650], baseFlow: 70 },
  { name: "Mevlana Bulvarı", start: [39.8900, 32.8500], end: [39.8800, 32.8700], baseFlow: 63 },
  { name: "Anadolu Bulvarı", start: [39.9300, 32.8700], end: [39.9400, 32.8900], baseFlow: 67 },
  { name: "Bilkent Yolu", start: [39.9334, 32.8597], end: [39.8800, 32.7500], baseFlow: 75 },
  { name: "Ümitköy - Çayyolu Aksı", start: [39.9500, 32.7000], end: [39.9700, 32.7300], baseFlow: 69 },
  { name: "Ankara Çevre Yolu (Kuzey)", start: [40.0000, 32.8000], end: [40.0200, 32.9000], baseFlow: 82 },
  { name: "Demetevler Yolu", start: [39.9450, 32.8200], end: [39.9550, 32.8400], baseFlow: 61 },
  { name: "Şehit Teğmen Kalmaz Cad.", start: [39.9100, 32.8700], end: [39.9200, 32.8850], baseFlow: 56 },
  { name: "Konya Yolu Kavşağı", start: [39.8700, 32.8600], end: [39.8600, 32.8800], baseFlow: 71 }
];

export const istanbulRoads: RoadData[] = [
  { name: "E-5 (Avrupa Yakası)", start: [41.0082, 28.8784], end: [41.0082, 29.0784], baseFlow: 85 },
  { name: "E-5 (Anadolu Yakası)", start: [40.9800, 29.0800], end: [40.9700, 29.2500], baseFlow: 87 },
  { name: "Bağdat Caddesi", start: [40.9700, 29.0800], end: [40.9850, 29.1200], baseFlow: 75 },
  { name: "TEM Otoyolu (Kuzey)", start: [41.0500, 28.8500], end: [41.0800, 29.1000], baseFlow: 90 },
  { name: "Boğaziçi Köprüsü", start: [41.0392, 29.0050], end: [41.0450, 29.0100], baseFlow: 80 },
  { name: "FSM Köprüsü", start: [41.1050, 29.0350], end: [41.1100, 29.0400], baseFlow: 82 },
  { name: "Büyükdere Caddesi", start: [41.0500, 28.9800], end: [41.1000, 29.0000], baseFlow: 70 },
  { name: "Barbaros Bulvarı", start: [41.0700, 29.0100], end: [41.0850, 29.0250], baseFlow: 68 },
  { name: "Şişli - Mecidiyeköy Hattı", start: [41.0550, 28.9850], end: [41.0650, 28.9950], baseFlow: 78 },
  { name: "Halkalı - Küçükçekmece", start: [41.0100, 28.6500], end: [41.0200, 28.7800], baseFlow: 73 },
  { name: "Kadıköy - Bostancı Sahil", start: [40.9900, 29.0300], end: [40.9650, 29.0900], baseFlow: 72 },
  { name: "Fatih Sultan Mehmet Bulvarı", start: [41.0300, 28.9500], end: [41.0500, 28.9700], baseFlow: 76 },
  { name: "Vatan Caddesi", start: [41.0150, 28.9400], end: [41.0250, 28.9600], baseFlow: 69 },
  { name: "Kennedy Caddesi (Sahil)", start: [41.0050, 28.9700], end: [40.9950, 29.0000], baseFlow: 65 },
  { name: "Basın Ekspres Yolu", start: [41.0000, 28.7800], end: [41.0200, 28.8500], baseFlow: 88 },
  { name: "D-100 Maltepe", start: [40.9400, 29.1200], end: [40.9300, 29.1600], baseFlow: 81 },
  { name: "Maslak - Ayazağa Yolu", start: [41.1000, 29.0200], end: [41.1150, 29.0350], baseFlow: 74 },
  { name: "Üsküdar - Çengelköy", start: [41.0250, 29.0150], end: [41.0400, 29.0550], baseFlow: 67 },
  { name: "Kağıthane Caddesi", start: [41.0800, 28.9700], end: [41.0950, 28.9850], baseFlow: 63 },
  { name: "Yavuz Sultan Selim Köprüsü", start: [41.1800, 29.1000], end: [41.1850, 29.1100], baseFlow: 79 }
];

export const izmirRoads: RoadData[] = [
  { name: "Şehit Fethi Bey Caddesi", start: [38.4237, 27.1328], end: [38.4337, 27.1528], baseFlow: 70 },
  { name: "Mustafa Kemal Sahil Bulvarı", start: [38.4100, 27.1200], end: [38.4400, 27.1600], baseFlow: 65 },
  { name: "Ankara Caddesi", start: [38.4200, 27.1400], end: [38.4350, 27.1450], baseFlow: 75 },
  { name: "İzmir-Aydın Otoyolu", start: [38.3800, 27.1500], end: [38.3500, 27.2000], baseFlow: 80 },
  { name: "Halkapınar Kavşağı", start: [38.4350, 27.1350], end: [38.4450, 27.1450], baseFlow: 78 },
  { name: "Bornova Caddesi", start: [38.4500, 27.2000], end: [38.4650, 27.2200], baseFlow: 72 },
  { name: "Gaziemir Yolu", start: [38.3800, 27.1300], end: [38.3600, 27.1500], baseFlow: 68 },
  { name: "Çeşme Otoyolu", start: [38.4237, 27.1428], end: [38.3500, 26.9000], baseFlow: 82 },
  { name: "Karşıyaka İskelesi - Bostanlı", start: [38.4600, 27.1100], end: [38.4750, 27.1300], baseFlow: 66 },
  { name: "Alsancak Caddesi", start: [38.4300, 27.1400], end: [38.4400, 27.1500], baseFlow: 73 },
  { name: "Kemalpaşa Caddesi", start: [38.4200, 27.1500], end: [38.4800, 27.2500], baseFlow: 71 },
  { name: "Gazi Bulvarı", start: [38.4100, 27.1350], end: [38.4250, 27.1450], baseFlow: 69 },
  { name: "Konak Meydanı Çevresi", start: [38.4180, 27.1280], end: [38.4240, 27.1380], baseFlow: 76 },
  { name: "İzmir Çevre Yolu", start: [38.4500, 27.2000], end: [38.5000, 27.2500], baseFlow: 85 },
  { name: "Manisa Yolu", start: [38.4400, 27.1800], end: [38.5000, 27.2300], baseFlow: 74 },
  { name: "Ege Üniversitesi Yolu", start: [38.4600, 27.2200], end: [38.4750, 27.2350], baseFlow: 62 },
  { name: "Çiğli - Menemen Yolu", start: [38.5000, 27.0500], end: [38.5500, 27.0200], baseFlow: 67 },
  { name: "Balçova Teleferik Yolu", start: [38.3900, 27.0300], end: [38.3800, 27.0450], baseFlow: 58 },
  { name: "Narlıdere Sahil", start: [38.3950, 27.0600], end: [38.3850, 27.0800], baseFlow: 61 },
  { name: "Buca - Kaynaklar Yolu", start: [38.3800, 27.1800], end: [38.3650, 27.2000], baseFlow: 64 }
];

export function getRoadsByCity(cityKey: string): RoadData[] {
  switch (cityKey) {
    case 'ankara':
      return ankaraRoads;
    case 'istanbul':
      return istanbulRoads;
    case 'izmir':
      return izmirRoads;
    default:
      return ankaraRoads;
  }
}

