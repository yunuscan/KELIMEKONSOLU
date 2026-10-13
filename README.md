# 🕹️ Retro Kelime Öğrenme & Hızlı Okuma İstasyonu (SEVGİLİM ÖĞRETMEN ONUN İÇİN)

Bu web uygulaması, öğrencilerin kelimeleri hızlı ve eğlenceli bir şekilde okumalarını ve öğrenmelerini sağlamak için tasarlanmış retro arcade tarzında bir web sitesidir.

## 🌟 Özellikler
- **Tam Ekran Desteği:** `⛶ Tam Ekran` butonu ile dikkat dağıtıcı tüm unsurlar gizlenir, kelime ekranda devasa boyutta görünür.
- **Ekrana Dokunarak İlerleme:** Ekranın herhangi bir yerine dokunulduğunda veya tıklandığında anında sıradaki kelimeye geçer.
- **Okudum & Konfeti Butonu:** `🎉 OKUDUM! ⭐` butonuna basıldığında renkli konfetiler patlar, 8-bit retro tebrik sesi çalar ve rastgele cesaret verici rozetler ("AFERİN! ⭐", "HARİKA! 🚀") çıkar.
- **Tüm Kelime Setleri (Görsellerdeki 280+ Kelime):**
  - Sayfa 187: Süt, Ayna, Tepe, Al, Gel, At / Tut, Bak, Sor, Yaz, Koş, Yat
  - Sayfa 188: Kart, Martı, Kent, Kork / Temiz, Tart, Kır, Tamir
  - Sayfa 189: Tak, Yor, Uyu, Sil / Saat, Telefon, Kapı, Kalem
  - Sayfa 190: Bilgisayar, Cam, Aşçı, Gün, Banka, Gök / Ter, Anla, Ser, Yak, Kal, Oyun
  - Sayfa 191: Yağmur, Karpuzun, Islanmak, Önlükleri...
- **Klavye Kısayolları (Bilgisayardan kullanım için):**
  - `Boşluk (Space)` veya `Sağ Ok (→)`: Sıradaki kelime
  - `Sol Ok (←)`: Önceki kelime
  - `Enter`: Okudum! (Konfeti patlatır ve skoru artırır)
  - `F Tuşu`: Tam Ekran aç/kapat
- **🔊 Sesli Dinleme Desteği:** Öğrenci kelimeyi okumakta zorlandığında hoparlör butonuna basarak Türkçe telaffuzunu dinleyebilir.
- **🔀 Karıştır (Shuffle) Modu:** Kelimelerin ezberlenmesini önlemek için rastgele sırada çalışma imkanı.

---

## 🚀 Vercel'de Yayınlama Rehberi

Bu proje **saf HTML, CSS ve JavaScript** ile geliştirilmiştir (sıfır karmaşıklık, hiçbir derleme veya ek paket gerektirmez).

### Yöntem 1: Vercel CLI İle (En Hızlısı)
Terminali (PowerShell) açın ve bu klasörde şu komutu çalıştırın:
```bash
npx vercel
```
Gelen sorulara `Enter` basarak onay verin. Yaklaşık 10 saniye içinde siteniz canlıya alınacaktır.

### Yöntem 2: GitHub & Vercel Dashboard İle
1. Bu klasördeki dosyaları bir GitHub deposuna yükleyin (`git push`).
2. [vercel.com](https://vercel.com) adresine gidin.
3. **Add New Project** butonuna tıklayıp GitHub deponuzu seçin.
4. Hiçbir ayarı değiştirmeden **Deploy** butonuna basın. Siteniz anında yayında!
