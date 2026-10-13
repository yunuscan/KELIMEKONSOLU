// Görsellerden özenle çıkarılmış okuma çalışması kelime veri seti
const WORD_SETS = [
  {
    id: "sayfa-187-mor",
    title: "Sayfa 187 - Grup 1 (Süt, Ayna, Tepe, Al, Gel, At)",
    color: "#9c27b0",
    words: [
      // Süt
      "Süt", "Sütçü", "Sütlük", "Sütçülük", "Sütçüler", "Sütlükler", "Sütçüden",
      // Ayna
      "Ayna", "Aynacı", "Aynacılar", "Aynalardan", "Aynacılarda", "Aynacılardaki", "Aynacıdaki",
      // Tepe
      "Tepe", "Tepeli", "Tepelik", "Tepelikçi", "Tepelerden", "Tepecilerden", "Tepesinde",
      // Al
      "Al", "Aldı", "Aldan", "Aldanmak", "Aldanmadan", "Aldanmasa", "Aldandık",
      // Gel
      "Gel", "Geldi", "Geldiler", "Gelmişler", "Gelmişlerdi", "Gelmişlerden", "Gelmişse",
      // At
      "At", "Atkı", "Atkılı", "Atkısını", "Atkılarının", "Atkıcı", "Atkıcılarda"
    ]
  },
  {
    id: "sayfa-187-yesil",
    title: "Sayfa 187 - Grup 2 (Tut, Bak, Sor, Yaz, Koş, Yat)",
    color: "#2e7d32",
    words: [
      // Tut
      "Tut", "Tutarken", "Tutmadan", "Tutamaçtakiler", "Tutunmak", "Tutunurken", "Tutsak",
      // Bak
      "Bak", "Bakmak", "Bakarken", "Bakınca", "Bakmadan", "Bakınmak", "Bakınsak",
      // Sor
      "Sor", "Soru", "Sorudaki", "Sorudakilerden", "Sorgula", "Sorgulamak", "Sorgulayıcı",
      // Yaz
      "Yaz", "Yazı", "Yazıda", "Yazıdaki", "Yazıdakilerden", "Yazarken", "Yazarlık",
      // Koş
      "Koş", "Koşmak", "Koşarken", "Koşu", "Koşudaki", "Koşudakiler", "Koşudakilerden",
      // Yat
      "Yat", "Yatarken", "Yatakta", "Yataktaki", "Yatırmadan", "Yatış", "Yatıştırma"
    ]
  },
  {
    id: "sayfa-188-mor",
    title: "Sayfa 188 - Grup 1 (Kart, Martı, Kent, Kork)",
    color: "#8e24aa",
    words: [
      // Kart
      "Kart", "Kartlar", "Kartlardan", "Kartta", "Karttan", "Kartlara", "Kartlıkların",
      // Martı
      "Martı", "Martılar", "Martılardan", "Martıda", "Martıdan", "Martılara", "Martılarla",
      // Kent
      "Kent", "Kentler", "Kentleri", "Kentlerden", "Kentlerde", "Kentte", "Kentten",
      // Kork
      "Kork", "Korku", "Korkulu", "Korkuluk", "Korkusuz", "Korkusuzca", "Korkut"
    ]
  },
  {
    id: "sayfa-188-yesil",
    title: "Sayfa 188 - Grup 2 (Temiz, Tart, Kır, Tamir)",
    color: "#388e3c",
    words: [
      // Temiz
      "Temiz", "Temizlik", "Temizlikçi", "Temizlikçiler", "Temizlikçilerle", "Temizlikçilerde", "Temizlikçilerden",
      // Tart
      "Tart", "Tartı", "Tartıl", "Tartılan", "Tartılanlar", "Tartılanlarda", "Tartılanlardan",
      // Kır
      "Kır", "Kırıl", "Kırılan", "Kırılanlar", "Kırılanlarla", "Kırılanlarda", "Kırılanlardan",
      // Tamir
      "Tamir", "Tamirci", "Tamirciler", "Tamircilerde", "Tamircilerden", "Tamircilerle", "Tamircilerin"
    ]
  },
  {
    id: "sayfa-189-mor",
    title: "Sayfa 189 - Grup 1 (Tak, Yor, Uyu, Sil)",
    color: "#7b1fa2",
    words: [
      // Tak
      "Tak", "Takı", "Takıları", "Takılardan", "Takıcılarda", "Takıcıların", "Takıcılarla",
      // Yor
      "Yor", "Yormak", "Yorulmuş", "Yorulmak", "Yorulmadan", "Yorulmuşken", "Yorgunlar",
      // Uyu
      "Uyu", "Uyumak", "Uyuklamak", "Uykuda", "Uyumadan", "Uyumuşken", "Uykusuz",
      // Sil
      "Sil", "Silmek", "Silinmiş", "Silenlerden", "Silinmişler", "Silgiler", "Silgiyi"
    ]
  },
  {
    id: "sayfa-189-yesil",
    title: "Sayfa 189 - Grup 2 (Saat, Telefon, Kapı, Kalem)",
    color: "#43a047",
    words: [
      // Saat
      "Saat", "Saatten", "Saatlerle", "Saatlerin", "Saatçiler", "Saatçilerden", "Saatçideki",
      // Telefon
      "Telefon", "Telefondan", "Telefonları", "Telefoncular", "Telefoncunun", "Telefoncudaki", "Telefoncuya",
      // Kapı
      "Kapı", "Kapıların", "Kapılardan", "Kapıcılar", "Kapıcılardan", "Kapıların", "Kapılarla",
      // Kalem
      "Kalem", "Kalemlerin", "Kalemlikleri", "Kalemlikte", "Kalemlikten", "Kalemlikteki", "Kalemliktekiler"
    ]
  },
  {
    id: "sayfa-190-mor",
    title: "Sayfa 190 - Grup 1 (Bilgisayar, Cam, Aşçı, Gün, Banka, Gök)",
    color: "#6a1b9a",
    words: [
      // Bilgisayar
      "Bilgisayar", "Bilgisayarın", "Bilgisayarda", "Bilgisayardan", "Bilgisayardaki", "Bilgisayardakilerden", "Bilgisayarcı",
      // Cam
      "Cam", "Camda", "Camın", "Camdaki", "Camdakiler", "Camdakilerden", "Camcı",
      // Aşçı
      "Aşçı", "Aşçıda", "Aşçıdaki", "Aşçıdakiler", "Aşçılardan", "Aşçılık", "Aşçılıkta",
      // Gün
      "Gün", "Günde", "Gündeki", "Gündekiler", "Gündekilerden", "Gündelik", "Günlük",
      // Banka
      "Banka", "Bankada", "Bankadaki", "Bankadakiler", "Bankadakilerden", "Bankacı", "Bankacılık",
      // Gök
      "Gök", "Gökte", "Gökyüzü", "Göklerde", "Gökyüzünde", "Gökyüzünün", "Göklerin"
    ]
  },
  {
    id: "sayfa-190-yesil",
    title: "Sayfa 190 - Grup 2 (Ter, Anla, Ser, Yak, Kal, Oyun)",
    color: "#2e7d32",
    words: [
      // Ter
      "Ter", "Terlemek", "Terlemesek", "Terlik", "Terlikçiyi", "Terliksi", "Terlerdi",
      // Anla
      "Anla", "Anlattık", "Anlamadı", "Anlasalar", "Anlam", "Anlamı", "Anlamını",
      // Ser
      "Ser", "Sergi", "Sergilerin", "Sermek", "Serinlesek", "Serinlerdik", "Serildi",
      // Yak
      "Yak", "Yakın", "Yaklaştı", "Yaksan", "Yakınlaşsak", "Yakındakilerle", "Yakında",
      // Kal
      "Kal", "Kalın", "Kalsaydın", "Kalıp", "Kalırsa", "Kalıptaki", "Kalınlar",
      // Oyun
      "Oyun", "Oynadı", "Oynasalar", "Oyundaki", "Oyuntu", "Oynasaydın", "Oyunlar"
    ]
  },
  {
    id: "sayfa-191",
    title: "Sayfa 191 - Hızlı Okuma Tablosu (Yağmur, Karpuzun, Islanmak...)",
    color: "#ba68c8",
    words: [
      // Sütun 1
      "Yağmur", "Kelebeklerin", "Vazo", "Uçakla", "Vermesek", "Pembeli", "Geziyormuş",
      // Sütun 2
      "Karpuzun", "Fanusta", "Elimizden", "Gelselerdi", "Gezdikçe", "Tekerlekleri", "Serinlemedik",
      // Sütun 3
      "Islanmak", "Balıkçısı", "Armutta", "Telefonsuz", "Paramızdaki", "Kağıttan", "Güneşlenmek",
      // Sütun 4
      "Önlükleri", "Şekerciden", "Makarnacıda", "Saçından", "Esnemiş", "Ayakkabısında", "Televizyondaki",
      // Sütun 5
      "Oyuncağının", "Okulunda", "Sınıfımızdan", "Kapısız", "Tokalarının", "Kitaplığımız", "Elmamızda",
      // Sütun 6
      "Arabasındaki", "Tahtaya", "Annesiyle", "Sağlıkla", "Futbolcudan", "Ellerimizin", "Tatildekilerden"
    ]
  }
];

// Tüm kelimelerin birleşik listesi
const ALL_WORDS = WORD_SETS.reduce((acc, set) => acc.concat(set.words), []);
