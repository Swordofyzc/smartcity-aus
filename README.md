# 🚦 SmartCity AUS - Trafik Simülasyonu

Türkiye'nin büyük şehirleri için gerçek zamanlı trafik simülasyonu ve olay müdahale planlama aracı.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6.svg)

## 🌟 Özellikler

### 🗺️ Çoklu Şehir Desteği
- **Ankara, İstanbul, İzmir** için gerçek harita koordinatları
- Şehirler arası sorunsuz geçiş (smooth transition)
- Her şehir için 120-150 dinamik yol segmenti

### ⚡ Gerçek Zamanlı Simülasyon
- 5 saniyede bir otomatik güncelleme
- Rush hour dinamiği (08:00-10:00 ve 17:00-19:00)
- Exponential smoothing ile yumuşak geçişler
- Yoğunluk tabanlı renk skalası (yeşil → sarı → turuncu → kırmızı)

### 🚨 Olay Yönetimi
- **3 olay tipi**: Kaza, Yol Çalışması, Araç Arızası
- Otomatik olay üretimi (20-40 saniye aralıklarla)
- Şiddet seviyesi tabanlı etki alanı
- Otomatik temizleme (süre dolunca)

### 🤖 Akıllı Müdahale Önerileri
- AI-benzeri öneri sistemi
- Olay tipine göre özelleştirilmiş aksiyonlar
- Tek tıkla uygulama (simülatif)

### 📊 İleri Tahmin Sistemi
- 15 dakikalık trafik yoğunluğu tahmini
- Exponential weighted average algoritması
- Trend analizi (artış/azalış/stabil)
- Rush hour faktörü entegrasyonu

### 📈 Detaylı Metrikler
- **Ortalama Trafik Skoru**: Anlık yoğunluk ortalaması
- **Aktif Olay Sayısı**: Devam eden olaylar
- **Tahmini Gecikme**: Toplam bekleme süresi
- **Trend Grafiği**: Son 30 dakikanın görsel analizi

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

```bash
# Projeyi klonlayın
git clone <repository-url>
cd smartcity-aus-traffic

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## 🎮 Kullanım

### Simülasyonu Başlatma
1. **Şehir seçin**: Üst menüden Ankara, İstanbul veya İzmir'i seçin
2. **Başlat butonuna tıklayın**: Simülasyon otomatik olarak çalışmaya başlar
3. **İzleyin**: Yol segmentleri ve olaylar gerçek zamanlı güncellenir

### Arayüz Bileşenleri

#### Harita
- **Renkli daireler**: Yol segmentlerini gösterir
- **Pinler**: Aktif olayları işaretler
- **Popup'lar**: Detaylı bilgi için segmentlere/olaylara tıklayın

#### KPI Kartları
- Sistem genelinde anlık metrikleri gösterir
- Renk kodlu görsel geri bildirim

#### Müdahale Önerileri Paneli
- Her olay için aksiyon planı
- "Uygula" butonu ile simülatif yanıt

#### Trend Grafiği
- Son 30 dakikanın yoğunluk geçmişi
- Renk gradyanlı çizgi grafiği

#### Olay Listesi
- Tüm aktif olayların tablo görünümü
- Şiddete göre filtreleme
- Kalan süre takibi

## 🛠️ Teknoloji Stack'i

- **Frontend Framework**: React 18.3.1
- **Tip Güvenliği**: TypeScript 5.5.3
- **State Yönetimi**: Zustand 5.0.0
- **Harita**: Leaflet 1.9.4 + React-Leaflet 4.2.1
- **Grafikler**: Recharts 2.12.0
- **Animasyonlar**: Framer Motion 11.0.0
- **Stil**: Tailwind CSS 3.4.15
- **İkonlar**: Lucide React 0.460.0
- **Tarih İşlemleri**: date-fns 4.1.0
- **Build Tool**: Vite 5.4.10

## 📁 Proje Yapısı

```
smartcity-aus-traffic/
├── src/
│   ├── components/
│   │   ├── Map.tsx              # Leaflet harita komponenti
│   │   ├── KPICards.tsx         # Metrik kartları
│   │   ├── IncidentPanel.tsx    # Olay ve tahmin paneli
│   │   ├── TrendChart.tsx       # Trend grafiği
│   │   └── IncidentList.tsx     # Olay listesi tablosu
│   ├── store/
│   │   └── trafficStore.ts      # Zustand global state
│   ├── types/
│   │   └── index.ts             # TypeScript tip tanımları
│   ├── utils/
│   │   └── simulation.ts        # Simülasyon algoritmaları
│   ├── App.tsx                  # Ana uygulama
│   ├── main.tsx                 # Giriş noktası
│   └── index.css                # Global stiller
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔬 Algoritma Detayları

### Yoğunluk Hesaplama
```typescript
// Exponential smoothing
const alpha = 0.3;
const rushMultiplier = isRushHour ? 1.4 : 1.0;
newIntensity = (baseFlow * rushMultiplier * randomFactor) * alpha + 
                currentIntensity * (1 - alpha);
```

### Olay Etkisi
```typescript
// Haversine mesafe hesabı
const distance = calculateDistance(segment, incident);
if (distance <= incident.affectedRadius) {
  const impactMultiplier = 1 - (distance / affectedRadius) * 0.5;
  intensity += severity * 10 * impactMultiplier;
}
```

### Tahmin Modeli
```typescript
// Exponential weighted average
const weights = [0.15, 0.25, 0.30, 0.30];
forecast = Σ(historicalData[i] * weights[i]);
if (willBeRushHour) forecast *= 1.2;
```

## 🎯 Gelecek Özellikler

- [ ] **Gerçek Trafik API Entegrasyonu**: Google Maps Traffic API
- [ ] **WebSocket Desteği**: Canlı veri akışı
- [ ] **Rota Optimizasyonu**: Dijkstra/A* algoritmaları
- [ ] **Makine Öğrenmesi**: ARIMA/LSTM ile tahmin
- [ ] **Mobil Uygulama**: React Native versiyonu
- [ ] **Çok Oyunculu Mod**: Eş zamanlı kullanıcılar
- [ ] **Senaryo Simülasyonu**: Özel olay oluşturma
- [ ] **Veri Export**: CSV/JSON rapor indirme

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 İletişim

Proje Sahibi - SmartCity AUS Ekibi

Proje Linki: [https://github.com/yourusername/smartcity-aus-traffic](https://github.com/yourusername/smartcity-aus-traffic)

---

⭐ Bu projeyi faydalı bulduysanız yıldız vermeyi unutmayın!

